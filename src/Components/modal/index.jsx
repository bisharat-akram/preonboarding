import { useState , useEffect} from 'react';
import { Button, Modal } from 'antd';
import { MdOutlineLayers } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa'
import Image from '../../assets/Modal/Image.png';
import Image1 from '../../assets/Modal/Image1.png';
import { useNavigate } from 'react-router-dom';
export const ModalComponent = ({ open, closeOpenModal }) => {
    const navigate = useNavigate();
    return (
        <>
            <Modal
                centered
                open={open}
                onCancel={() => closeOpenModal(false)}
                width={1000}
                okButtonProps={{
                    hidden: true,
                }}
                cancelButtonProps={{
                    hidden: true,
                }}
                destroyOnClose
            >
                <div className='w-full h-full p-0'>
                    <footer className='flex gap-5 items-center p-2'>
                        <div className='p-2 rounded' style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}>

                            <MdOutlineLayers size={30} />
                        </div>
                        <div className='mt-1'>
                            <h2 className='font-semibold text-lg '>How would you like to start?</h2>
                            <p className='font-normal text-sm'>Select the best way to explore and engage with your data. Don’t worry, you can always explore everything later in your dashboard.</p>
                        </div>
                    </footer>
                    <section className='flex items-center gap-5 mt-10'>
                        <div className='p-5' style={{
                            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            borderRadius: "10px"
                        }}>
                            <div className='w-full h-full' style={{
                                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                borderRadius: "10px"
                            }}>
                                <img src={Image} className='w-full h-full object-cover' />
                            </div>
                            <div className='mt-5'>
                                <h1 className='font-semibold text-2xl'>
                                    Custom Model
                                </h1>
                                <p className='text-base font-normal'>
                                    Use your custom SMILES
                                    string data to create a personalized model for your formulations. Tailored results, but may take up to 24 hours to process.
                                </p>
                            </div>
                        </div>
                        <div className='p-5' style={{
                            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            borderRadius: "10px"
                        }}>
                            <div className='w-full h-full' style={{
                                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                borderRadius: "10px"
                            }}>
                                <img src={Image1} className='w-full h-full object-contain' />
                            </div>
                            <div className='mt-5'>
                                <h1 className='font-semibold text-2xl'>
                                    Ask PAGI
                                </h1>
                                <p className='text-base font-normal'>
                                    Interact with our AI-powered chatbot to get immediate insights on your materials. Instant answers, but limited to publicly known properties.
                                </p>
                            </div>
                        </div>
                    </section>
                    <footer className='flex gap-5 items-center justify-between mt-10'>
                        <Button ghost onClick={() => closeOpenModal(false)} style={{ color: 'black', fontWeight: '600', padding: '20px', boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px", border: '0px' }}>
                            Go to Dashboard
                        </Button>
                        <Button type="primary" onClick={() =>navigate('/modal')} style={{ background: '#079455', fontWeight: '600', padding: '20px' }}>
                            Proceed
                            <FaArrowRight />
                        </Button>
                    </footer>
                </div>
            </Modal >
        </>
    );
};
