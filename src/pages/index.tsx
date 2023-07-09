import Head from 'next/head'
import { 
  useAccount, 
  useEnsName,
  useSignMessage,
  useNetwork,
} from 'wagmi'

import {
  hashPDFData,
  verifySignature,
} from '@/utils/crypto_helpers';

import { LoadingSpinner } from '@/components/loadingSpinner';
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'
import { useIsMounted } from '@/hooks/useIsMounted'
import { FileUploader } from 'react-drag-drop-files';
import { useState, useEffect } from 'react';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { DownloadModal } from '@/components/downloadModal';
import { VerificationModal } from '@/components/verificationModal';
import { wrapText } from '@/utils/pdf_helpers';

// Currently only supports PDF file type
const fileTypes = ["PDF"];

export default function Home() {
  const [file, setFile] = useState(null);
  const [hashValue, setHashValue] = useState('');
  const [ preSignatureString, setPreSignatureString ] = useState(''); // [ensName ?? address] + [timestamp] + [hashValue]
  const [ signature, setSignature ] = useState('');
  const [ isAffixing, setIsAffixing ] = useState(false); 
  const [isDownloadModal, setIsDownloadModal] = useState(false);
  const [ isVerificationModal, setIsVerificationModal ] = useState(false);
  const [signaturePosition, setSignaturePostion] = useState('top');
  const [timestamp, setTimestamp ] = useState(Date.now());
  const [ finalMessage, setFinalMessage ] = useState(''); 
  const isMounted = useIsMounted() // Prevent Next.js hydration errors
  const { address } = useAccount() // Get the user's connected wallet address
  const { chain } = useNetwork()


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
  const { signMessage, isLoading: signatureLoading } = useSignMessage({
    message: preSignatureString,
    onMutate(args) {
      setFinalMessage(args.message);
    },
    onSuccess(data) {
      setSignature(data);
      // Show modal after successful sign
      setIsDownloadModal(true);
    }
  });


  const signPDFAndCloseModal = () => {
    signPDF();
    setIsDownloadModal(false);
  }

  // TODO: Should be able to refactor below
  // Handle file upload, as well as set preSignatureString and hashValue once file is uploaded
  const handleFileChange = (file: any) => {
    setFile(file);
    const reader = new FileReader();

    // Create a hash of the file data
    reader.onload = () => {
      const fileData = new Uint8Array(reader.result as ArrayBuffer);
      const hashValue = hashPDFData(fileData);
      setHashValue(hashValue);
      setPreSignatureString(`${ensName ?? address} signed ${hashValue} at unix-time ${timestamp}`);
    };

    reader.readAsArrayBuffer(file);
  }

  const signPDF = async () => {

    if (!file || !signature) {
      return;
    }
  
    setIsAffixing(true);

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
      const unsignedMessage = finalMessage;
      const signedMessage = `Signature: ${signature}`

      // The Signature stretches beyond the page, therefore you need to do some line-wrapping to make it work
      const wrappedSignedMessage: string[] = wrapText(signedMessage, width - 20, helveticaFont);

      // Add message to the top left/bottom left corner of the PDF's first page
      firstPage.drawText(unsignedMessage, {
        x: 10,
        y: signaturePosition === 'top' ? height - 20 : 50,
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      let newLineYPositionAdjustment = 0;

      for (const line of wrappedSignedMessage) {

        firstPage.drawText(line, {
          x: 10,
          y: signaturePosition === 'top' ? (height - 35 - newLineYPositionAdjustment) : 35 - newLineYPositionAdjustment,
          size: 8,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });

        newLineYPositionAdjustment += 12;

      }
      
      // Name the PDF and save it locally
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileName: string = (file as any)?.name ? `${(file as any).name.replace(/\.pdf$/, '')}_signed.pdf` : `${timestamp}_signed.pdf`;
      link.href = url;
      link.download = fileName;
      link.target = "_blank";
      link.click();
      URL.revokeObjectURL(url);

      setIsAffixing(false);
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
          {isMounted && address && chain?.id !== 1 ? 
            <p className='text-md text-red-500'>
              Please connect to the Ethereum mainnet to use this application.
            </p>
            :
            null}
          <button 
            className='mr-auto italic text-blue-600 underline hover:cursor-pointer'
            // onClick={() => setIsVerificationModal(true)}
          >
            Verify a Signature (Coming soon...)
          </button>
          <p className='text-md'>
            This application allows you to attach a unique cryptographic signature to the top of a PDF file. This signature can be used to verify the authenticity of the file and the identity of the signer. We currently support PDF files only.
          </p>

          <FileUploader
            handleChange={handleFileChange}
            name="file"
            types={fileTypes}
            multiple={false}
            
          />

          { file ?
              <p className='text-green-600'>File uploaded successfully!</p> :
              null 
          }

          <p>
            <span className='font-bold'>Hash of file (SHA-256):</span> <span className='font-code  text-sm'>{hashValue}</span>
          </p>
          {/* If the page is hydrated and the user is connected, show the rest of the page */}
          {isMounted && address ? (
            <>
            <p className='font-bold'>String to be signed:</p>
            <p>
              {`${ensName ?? address} signed ${hashValue} at unix-time ${timestamp}`}
            </p>
            <p className='font-bold'>Signature:</p>
            <p className='font-code text-sm break-words'>{signature}</p>
            </>
          ) : (
            <p className='text-blue-500 italic'>Please connect wallet to use complete functionality.</p>
          )}
          <div className='flex flex-row justify-around'>
          <button
            type="button"
            onClick={() => signMessage()}
            disabled={!isMounted || !address || !file || !hashValue}
            className="flex flex-row ml-auto disabled:bg-gray-400 disabled:hover:cursor-not-allowed max-w-3xl min-w-xl rounded-md bg-blue-600 px-16 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {!signatureLoading ? "Sign and Affix" : <><LoadingSpinner /> Loading... </>}
          </button>
          {isDownloadModal && <DownloadModal 
                        title="Confirm" 
                        content="Content" 
                        close={signPDFAndCloseModal}
                        changeSelectedValue={(value) => setSignaturePostion(value)} /> }
          {isVerificationModal && <VerificationModal
                        close={() => setIsVerificationModal(false)} /> }
          </div>
        </Container>
        <Footer />
      </Layout>
    </>
  )
}


