import React, { useEffect, useState } from 'react';
import icondual from '../assets/icondual.png'
import dots3 from '../assets/dots3.png'
import '../CSS/Dashboard.css'
import { Button, Segmented } from 'antd';
import config from "../../amplify_outputs.json";
import { fetchAuthSession } from 'aws-amplify/auth'
import { get } from 'aws-amplify/api';
import { useNavigate } from 'react-router-dom';
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
const ImageModel = () => {
   
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    async function getList() {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken
            console.log(session)
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
            result = result.reduce((prev, curr) => {
                if (curr.startsWith(`assets/${session.userSub}`)) {
                    let urlarr = curr.split('/');
                    let id = urlarr[2]
                    if (prev) {
                        prev[id] = 1;
                    } else {
                        prev = { [id]: 1 }
                    }
                }
                console.log(prev)
                return prev;
            }, 0);
            // let ids = result.map((data) => {
            //     let urlarr = data.split('/');

            //     let id = urlarr[2]
            //     console.log(id);
            //     return id;
            // })

            setImages(result)
            console.log(result)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {


        getList()
    }, [])
    return (
        <div className='dashboard' >
            <div className="flex flex-col modalsheading" >
                <p className='text-start'>Models (4)</p>
                <div className='flex justify-between'>
                    <p>View your recent models and their current statuses. Manage all your formulations in the Models section.</p>
                    <a href='#' >View All</a>
                </div>
            </div>
            <div className='modals'>
                {Object.keys(images).map((data) => <div className="child">
                    <div className="flex justify-between w-full gap-4 items-center images" >
                        <img src={icondual}></img>
                        <span ><img src={dots3}></img></span>
                    </div>
                    <div className="content"  >
                        <div className="pill" >
                            <p>Processing
                            </p>
                        </div>

                        <p className='text-start text-title'>Model Testing 03</p>
  
                        <p className='text-start  createdtime' >Created: May 17, 2024 11:18 PM</p>
                        <Button style={{ background: 'rgba(236, 253, 243, 1)' }} onClick={() => {
                            navigate(`/model/${data}`)
                        }}>

                            <div className='view' >
                                <p>Approximately 3 hours left</p>
                            </div>
                        </Button>
                    </div>
                </div>)}

            </div>
        </div>
    );
};
export default ImageModel;