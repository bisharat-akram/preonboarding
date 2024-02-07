import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { Container, Row, Col, Button, Spinner, Form, Pagination } from 'react-bootstrap';
import Select from 'react-select';
import Papa from 'papaparse';
import FileTable from './FileTable';

function FileDetailsPage() {
    const [isLoading, setIsLoading] = useState(false);

    const [fileData, setFileData] = useState([]);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;
    const maxPageItems = 5;

    const { fileKey } = useParams();

    useEffect(() => {
        getSignUrl();
    }, []);

    const getSignUrl = async () => {
        const getUrlResult = await getUrl({
            key: fileKey
        });
        const signedUrl = getUrlResult.url.href;
        const response = await fetch(signedUrl);
        const text = await response.text();
        Papa.parse(text, {
            header: true,
            complete: (results) => {
                setFileData(results.data);
                setIsLoading(false);
            },
            error: (error) => {
                console.error('Error parsing CSV file:', error);
                setIsLoading(false);
            }
        });
    }

    const handleRowSelect = (index) => {
        if (selectedRows.has(index)) {
            selectedRows.delete(index);
        } else {
            selectedRows.add(index);
        }
        setSelectedRows(new Set(selectedRows));
    };


    const submitData = () => {
        const payload = Array.from(selectedRows).map(rowIndex => {
            const row = fileData[rowIndex];
            return selectedColumns.reduce((acc, col) => {
                acc[col.value] = row[col.value];
                return acc;
            }, {});
        });
        console.log(payload);
        // Here you can further process the payload as required
    };

    const calculateTotalPages = (data, rowsPerPage) => {
        return Math.ceil(data.length / rowsPerPage);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const getPaginationItems = (currentPage, totalPages) => {
        let items = [];
        let startPage, endPage;

        if (totalPages <= maxPageItems) {
            // less than maxPageItems total pages, show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than maxPageItems total pages, calculate start and end pages
            const maxPagesBeforeCurrentPage = Math.floor(maxPageItems / 2);
            const maxPagesAfterCurrentPage = Math.ceil(maxPageItems / 2) - 1;
            if (currentPage <= maxPagesBeforeCurrentPage) {
                startPage = 1;
                endPage = maxPageItems;
            } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
                startPage = totalPages - maxPageItems + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - maxPagesBeforeCurrentPage;
                endPage = currentPage + maxPagesAfterCurrentPage;
            }
        }

        // create page items
        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
                    {number}
                </Pagination.Item>,
            );
        }

        return items;
    };


    const CSVTable = ({ data }) => {
        if (data.length === 0) {
            return null;
        }

        const headers = Object.keys(data[0]);
        const columnOptions = headers.map(header => ({ value: header, label: header }));
        const isAllSelected = data.length > 0 && selectedRows.size === data.length;

        const handleSelectAllRows = (e) => {
            if (e.target.checked) {
                setSelectedRows(new Set(data.map((_, index) => index)));
            } else {
                setSelectedRows(new Set());
            }
        };

        const indexOfLastRow = currentPage * rowsPerPage;
        const indexOfFirstRow = indexOfLastRow - rowsPerPage;
        const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

        const totalPages = calculateTotalPages(data, rowsPerPage);
        const paginationItems = getPaginationItems(currentPage, totalPages);

        // let paginationItems = [];
        // for (let number = 1; number <= totalPages; number++) {
        //     paginationItems.push(
        //         <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
        //             {number}
        //         </Pagination.Item>,
        //     );
        // }

        return (
            <>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                    <div style={{ flex: 1, marginRight: '10px' }}>
                        <Select
                            options={columnOptions}
                            isMulti
                            isSearchable
                            className="mb-0"
                            placeholder="Select Table Columns"
                            onChange={setSelectedColumns}
                            value={selectedColumns}
                        />
                    </div>

                    <Button onClick={submitData}>Submit Data</Button>

                </div>
                <table className='mt-5'>
                    <thead>
                        <tr>
                            <th className="table-checkbox">
                                <Form.Check
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAllRows}
                                />
                            </th>
                            {headers.map((header, index) => (
                                <th key={index} className="table-header">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row, index) => (
                            <tr key={index}>
                                <td className="table-checkbox">
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedRows.has(index)}
                                        onChange={() => handleRowSelect(index)}
                                    />
                                </td>
                                {headers.map((header, idx) => (
                                    <td key={idx} className="table-cell">{row[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
                    <Pagination>
                        <Pagination.Prev onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} />
                        {currentPage > 1 + maxPageItems && (
                            <>
                                <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                                <Pagination.Ellipsis disabled />
                            </>
                        )}
                        {paginationItems}
                        {currentPage < totalPages - maxPageItems && (
                            <>
                                <Pagination.Ellipsis disabled />
                                <Pagination.Item onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>
                            </>
                        )}
                        <Pagination.Next onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>

            </>
        );
    };


    return (
        <Container fluid>
            <Row className="px-4 my-5">
                <Col sm={12}>
                    <h2 className="font-weight-light text-center">Uploaded File Details</h2>
                    <p><a href="/">Back to Files</a></p>

                    {/* Loader or Message */}
                    {isLoading ? (
                        <div style={{ textAlign: 'center', margin: '20px' }}>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <CSVTable data={fileData} />
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default FileDetailsPage;