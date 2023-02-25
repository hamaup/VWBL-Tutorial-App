import React, { useCallback, useEffect, useState } from 'react';
import { Image, Box, Button } from '@chakra-ui/react';
import ReactPlayer from 'react-player';
import { VALID_EXTENSIONS } from '../../../utils';
import { PdfViewer } from './../pdf-viewer';
import './FileViewer.css';


export const FileViewer = ({ nft }) => {
  const [fileUrl, setFileUrl] = useState('');

  const isExtractMetadata = (token) => {
    return !!token?.ownDataBase64;
  };

  const download = useCallback(() => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.click();
    a.remove();
  }, [fileUrl]);

  useEffect(() => {
    if (isExtractMetadata(nft)) {
      const url =
        nft.encryptLogic === 'base64'
          ? nft.ownDataBase64[0]
          : URL.createObjectURL(new Blob(nft.ownFiles, { type: nft.mimeType }));
      setFileUrl(url);
    }

    // unset memory when unmount
    return () => URL.revokeObjectURL(fileUrl);
  }, []);

  const switchViewer = useCallback(
    (nft) => {
      if (isExtractMetadata(nft)) {
        if (nft.mimeType.match(VALID_EXTENSIONS.image)) {
          return <Image src={fileUrl} alt='original data' rounded='md' width='100%' height='100%' objectFit='contain' />;
        } else if (nft.mimeType.match(VALID_EXTENSIONS.video)) {
          return <ReactPlayer url={fileUrl} controls width='100%' height='100%' />;
        } else if (nft.mimeType.match(VALID_EXTENSIONS.audio)) {
          return <ReactPlayer url={fileUrl} controls height='54px' />;
        } else if (nft.mimeType.includes('pdf')) {
          return <PdfViewer fileUrl={fileUrl} />;
        } else {
          return <Button onClick={download}>Download</Button>;
        }
      } else {
        return <Image src={nft.image} alt="NFT" height='100%' width='100%' rounded='md'/>;
      }
    },
    [download, fileUrl],
  );

  return (
    <Box mx='auto' maxH='100%' maxW='100%' display='flex' justifyContent='center' alignItems='center'>
      {switchViewer(nft)}
    </Box>
  );
};
