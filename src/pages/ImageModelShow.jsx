import React, { useEffect } from 'react';
import ImageModel from '../Components/imagemodels';
const ImageModelShow = () => {
    useEffect(()=>{console.log('imagemodelcomp')},[])
    return (
        <>
            <ImageModel></ImageModel>
        </>
    );
};
export default ImageModelShow;