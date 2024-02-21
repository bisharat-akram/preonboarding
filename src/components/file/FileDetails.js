import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { Container, Row, Col, Button, Spinner, Form, Pagination, Alert } from 'react-bootstrap';
import Select from 'react-select';
import Papa from 'papaparse';
import FileTable from './FileTable';
import predictedImageUrl from "../../assets/img/Actual_vs_Predicted.png";

function FileDetailsPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [fileData, setFileData] = useState([]);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("warning");
    const [alertMessage, setAlertMessage] = useState("");
    const [predictedImage, setPredictedImage] = useState("");

    const rowsPerPage = 20;
    const maxPageItems = 5;

    const apiUrl = "https://m1vqmhqu9g.execute-api.us-west-1.amazonaws.com/dev/";

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

        setAlertType("info");
        setAlertMessage("Your request is being processed. Please wait...");
        setShowAlert(true);

        const payload = selectedColumns.reduce((acc, col) => {
            let data = {};

            Array.from(selectedRows).map(rowIndex => {
                const row = fileData[rowIndex];
                let value = row[col.value];
                const parsedValue = parseFloat(value);
                if (parsedValue.toString() === value.toString()) {
                    // If the parsed value is the same as the original, convert to number
                    value = parsedValue;
                }

                data = {
                    ...data,
                    [rowIndex.toString()]: value
                }
            });

            acc[col.value] = data;
            return acc;
        }, {});

        axios({
            method: 'post',
            url: apiUrl,
            data: payload
        }).then(response => {
            setAlertType("success");
            setAlertMessage("Data submitted successfully");
            setShowAlert(true);
            const res = response.data;
            console.log(JSON.parse(res.body));
            if (res?.statusCode === 200) {
                const body = JSON.parse(res.body);
                setPredictedImage(predictedImageUrl);
            }
        }).catch(error => {
            console.error('Error submitting data:', error);
            setAlertType("danger");
            setAlertMessage("Error submitting data");
            setShowAlert(true);
            setPredictedImage("")
        });
    };

    const resetAlert = () => {
        setShowAlert(false);
        setAlertMessage("");
        setPredictedImage("");

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

    const backToTable = () => {
        setPredictedImage("");
    }


    return (
        <Container fluid>
            {
                predictedImage === "" &&
                <Row className="px-4 my-5">
                    <Col sm={12}>
                        <h2 className="font-weight-light text-center">Uploaded File Details</h2>
                        <p><a href="/">Back to Files</a></p>

                        {showAlert && (
                            <Alert variant={alertType} onClose={() => resetAlert()} dismissible>
                                {alertMessage}
                            </Alert>
                        )}

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
            }

            {
                predictedImage &&
                <div style={{ width: '100%', padding: '10px 40px' }}>
                    <p style={{ cursor: 'pointer' }} onClick={() => resetAlert()}>Back to Data Table</p>
                    <img
                        style={{ display: 'block', margin: 'auto' }}
                        src={predictedImage}
                    />
                </div>
            }
        </Container>
    )
}

export default FileDetailsPage;