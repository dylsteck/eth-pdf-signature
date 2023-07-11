import { Layout } from "@/components/atoms";
import { useState } from "react";
import { verifySignature } from "@/utils/crypto_helpers";


export default function Verify() {
    const [ message, setMessage ] = useState('')
    const [ signature, setSignature ] = useState('')
    const [ verificationStatus, setVerificationStatus ] = useState(false);
    const [ showVerification, setShowVerification ] = useState(false);
    const [ publicKey, setPublicKey ] = useState('')

    const handleVerification = () => {
        const verified = verifySignature(message, signature, publicKey.toLowerCase());
        setVerificationStatus(verified);
        setShowVerification(true);
    }

    const verifyDesc = `You can verify a signature by pasting the message, signature, and the signer's public key below: `
    return (
        <Layout>
        <h1>Verify a signed PDF</h1>
        <div className='bg-white p-8 rounded-lg shadow-sm border border-gray-300'>
                <h2 className='text-xl font-bold mb-4'>Verify a Signature</h2>
                <p className='mb-4 text-md'>{verifyDesc}</p>
                <p className="text-sm italic font-light">(Make sure to avoid any extra spaces on either end of the string, verification requires precision)</p>
                <div className='flex flex-col'>
                    <div className='my-2'>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Message
                        </label>
                        <div className="mt-2">
                            <textarea
                            name="message"
                            id="message"
                            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>
                        <div className='my-2'>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Signature
                        </label>
                        <div className="mt-2">
                            <textarea
                            name="signature"
                            id="signature"
                            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(e) => setSignature(e.target.value)}
                            />
                        </div>
                    </div>
                    </div>
                        <div className='my-2'>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Public Key of Signer
                        </label>
                        <div className="mt-2">
                            <textarea
                            name="signature"
                            id="signature"
                            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(e) => setPublicKey(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <p className='my-2 text-md'>
                            Verification Status: {showVerification ?
                            (verificationStatus ? <span className='text-green-600'>Verified</span> : <span className='text-red-600'>Not Verified</span>) : null}
                        </p>
                        <button
                            type="button"
                            onClick={handleVerification}
                            className="my-2 rounded-md bg-blue-600 px-16 py-2 max-w-lg text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Verify
                        </button>
                    </div>
                    
                </div>
        </Layout>
    );
}
