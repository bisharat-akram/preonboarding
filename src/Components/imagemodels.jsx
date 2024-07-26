import React, { useEffect, useState } from 'react';
import icondual from '../assets/icondual.png'
import dots3 from '../assets/dots3.png'
import '../CSS/Dashboard.css'
import { Button, Segmented } from 'antd';
import config from "../../amplify_outputs.json";
import { fetchAuthSession } from 'aws-amplify/auth'
import { get } from 'aws-amplify/api';
import { useNavigate } from 'react-router-dom';
import { list } from 'aws-amplify/storage';
const items = [
    {
        key: '1',
        label: 'Tab 1',
        children: 'Content of Tab Pane 1',
    },
    {
        key: '2',
        label: 'Tab 2',
        children: 'Content of Tab Pane 2',
    },
    {
        key: '3',
        label: 'Tab 3',
        children: 'Content of Tab Pane 3',
    },
];
const ImageModel = ({ value, getImage=()=>{} }) => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [cognitoFile, setCognitoFile] = useState([]);
    
    async function getList() {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken
            let restOperation = get({
                apiName: config.custom.API.myRestApi.apiName,
                path: `getimagediffbucket?user=${session?.userSub}`,
                options: {
                    headers: {
                        Authorization: token
                    }
                }
            });
            let result = await restOperation.response;
            result = await result.body.json()
            const currentDate = new Date();
            let pastDate = new Date();
            let filterdate = 30;
            if (value === '7 days') {
                filterdate = 7;
            }
            else if (value === '24 hours') {
                filterdate = 1;
            }
            pastDate.setDate(currentDate.getDate() - filterdate);
            console.log(result)
            result = result.reduce((prev, curr) => {
                console.log(curr?.key, '=>', curr?.key, '=>', prev);
                if (curr?.key?.startsWith(`assets/${session.userSub}`) && new Date(curr?.meta?.LastModified) >= pastDate) {
                    let urlarr = curr?.key?.split('/');
                    let id = urlarr[2]
                    if (prev) {
                        prev[id] = curr?.meta?.LastModified;
                    } else {
                        prev = {[id]:curr?.meta?.LastModified};
                    }
                }
                console.log(prev)
                return prev;
            }, 0);
            const cognitobucket = await list({
                path: `files-submissions/${session?.userSub}`,
            });
            getImage(result)
            setImages(result)
            setCognitoFile(cognitobucket.items)
            console.log(cognitobucket)
            console.log(result)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {


        getList()
    }, [value])
    return (
        <div className='dashboard' >
            <div className="flex flex-col modalsheading" >
                {console.log(images)}
                <p className='text-start'>Models {Object.keys(images)?.length}</p>
                <div className='flex justify-between'>
                    <p>View your recent models and their current statuses. Manage all your formulations in the Models section.</p>
                    <a href='#' >View All</a>
                </div>
            </div>
            <div className='modals'>
                {Object.keys(images).map((data,index) => <div className="child">
                    <div className="flex justify-between w-full gap-4 items-center images" >
                        <img src={icondual}></img>
                        <span ><img src={dots3}></img></span>
                    </div>
                    <div className="content"  >
                        <div className="pill" >
                            <p>Ready to Use
                            </p>
                        </div>

                        <p className='text-start text-title'>Model Testing {index+1}</p>
                        {console.log(images[data])}
                        <p className='text-start  createdtime' >Created: {new Date(images[data]).toUTCString()}</p>
                        <Button style={{ background: 'rgba(236, 253, 243, 1)' }} onClick={() => {
                            navigate(`/model/${data}`, { state: { props: { modelName: `Model Testing ${index + 1}`, date: new Date(images[data]).toUTCString() } } })
                        }}>

                            <div className='view' >
                                <p>Open</p>
                            </div>
                        </Button>
                    </div>
                </div>)}

            </div>
        </div>
    );
};
export default ImageModel;