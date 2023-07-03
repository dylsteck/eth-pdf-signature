import Head from 'next/head'
import { 
  useAccount, 
  useEnsName,
  useSignMessage
} from 'wagmi'

import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'
import { useIsMounted } from '@/hooks/useIsMounted'
import { FileUploader } from 'react-drag-drop-files';
import { useState, useEffect } from 'react';
import * as crypto from 'crypto';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Currently only supports PDF file type
const fileTypes = ["PDF"];

export default function Home() {
  const [file, setFile] = useState(null);
  const [hashValue, setHashValue] = useState('');
  const [ preSignatureString, setPreSignatureString ] = useState(''); // [ensName ?? address] + [timestamp] + [hashValue]
  const [ signature, setSignature ] = useState('');
  const [timestamp, setTimestamp ] = useState(Date.now());
  const isMounted = useIsMounted() // Prevent Next.js hydration errors
  const { address } = useAccount() // Get the user's connected wallet address

  // Update timestamp every 10 seconds, easily adjustable
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimestamp(Date.now());
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const { data: ensName } = useEnsName({
    address,
    chainId: 1, // We always want to use ETH mainnet for ENS lookups
  })

  // Hook for signing message
  const { signMessage } = useSignMessage({
    message: preSignatureString,
    onSuccess(data) {
      setSignature(data);
    }
  });

  // Handle file upload, as well as set preSignatureString and hashValue once file is uploaded
  const handleFileChange = (file: any) => {
    setFile(file);
    const reader = new FileReader();

    // Create a hash of the file data
    reader.onload = () => {
      const fileData = new Uint8Array(reader.result as ArrayBuffer);
      const hashValue = hashPDFData(fileData);
      setHashValue(hashValue);
      setPreSignatureString("I, " + (ensName ?? address!) + ", verify that at time "  +  timestamp + " I am signing the following hash and affixing it to this PDF file: " + hashValue);
    };

    reader.readAsArrayBuffer(file);
  }

  const signPDF = async () => {

    if (!file || !signature) {
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = async () => {
      // Load PDF from Uint8Array
      const fileData = new Uint8Array(reader.result as ArrayBuffer);
      const pdfDoc = await PDFDocument.load(fileData);
  
      // Initialize vars for PDF manipulation
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      const message = `I, ${ensName ?? address}, am signing this PDF at time ${timestamp}:\n${signature}`;
  
      // Add message to the top left corner of the PDF's first page
      firstPage.drawText(message, {
        x: 10,
        y: height - 20,
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Name the PDF and save it locally
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileName = file?.name ? `${file.name.replace(/\.pdf$/, '')}_signed.pdf` : `${timestamp}_signed.pdf`;
      link.href = url;
      link.download = fileName;
      link.target = "_blank";
      link.click();
      URL.revokeObjectURL(url);
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  return (
    <>
      <Head>
        <title>Web3 Sign a PDF</title>
        <meta name="description" content="This application allows you to attach a unique cryptographic signature to the top of a PDF file." />
        <meta property="og:image" content="" />
        <meta property="og:title" content="Web3 Sign a PDF" />
        <meta property="og:description" content="This application allows you to attach a unique cryptographic signature to the top of a PDF file." />
      </Head>

      <Layout>
        <Nav />
        <Container
          as="main"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <h1>Sign a PDF w/ your Wallet</h1>
          <p className=' text-md'>
            This application allows you to attach a unique cryptographic signature to the top of a PDF file. This signature can be used to verify the authenticity of the file and the identity of the signer. We currently support PDF files only.
          </p>
          <FileUploader
            handleChange={handleFileChange}
            name="file"
            types={fileTypes}
            multiple={false}
            
          />
          { file ?
              <p className='text-green-500'>File uploaded successfully!</p> :
              null 
          }
          <p>
            <span className='font-bold'>Hash of file (SHA-256):</span> <span className='font-code bg-gray-200 text-sm'>{hashValue}</span>
          </p>
          {/* If the page is hydrated and the user is connected, show their address */}
          {isMounted && address ? (
            <>
            <p className='font-bold'>String to be hashed:</p>
            <p>
              {/* I'm happy to change the language here if we think of something better. */}
              I, <span className='font-code bg-gray-200 text-sm'>{ensName ?? address}</span>, verify that at time <span className='font-code bg-gray-200 text-sm'>{timestamp}</span> I am signing the following hash and affixing it to this PDF file: <span className='font-code bg-gray-200 text-sm'>{hashValue}</span>
            </p>
            <p>
              <br/>
              <span className='font-bold'>Signature:</span> <span className='font-code bg-gray-200 text-sm break-words'>{signature}</span>
            </p>
            </>
          ) : (
            <p className='text-blue-500 italic'>Please connect wallet to use complete functionality.</p>
          )}
          <div className='flex flex-row justify-around'>
          <button
            type="button"
            onClick={() => signMessage()}
            disabled={!isMounted || !address || !file || !hashValue}
            className="disabled:bg-gray-400 disabled:hover:cursor-not-allowed max-w-3xl min-w-xl rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Sign Message
          </button>
          <button
            type="button"
            disabled={!isMounted || !address || !file || !hashValue || !signature}
            onClick={() => signPDF()}
            className="disabled:bg-gray-400 disabled:hover:cursor-not-allowed max-w-3xl min-w-xl rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Affix to PDF
          </button>
          </div>
        </Container>
        <Footer />
      </Layout>
    </>
  )
}


function hashPDFData(data: Uint8Array) {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  const hashValue = hash.digest('hex');
  return hashValue;
}