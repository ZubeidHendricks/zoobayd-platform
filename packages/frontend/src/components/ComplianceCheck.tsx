import React, { useState } from 'react';
import axios from 'axios';

const ComplianceCheck: React.FC = () => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        nationality: '',
        documentId: ''
    });

    const [transaction, setTransaction] = useState({
        amount: 0,
        fromAddress: '',
        toAddress: '',
        blockchain: 'ethereum'
    });

    const [complianceResult, setComplianceResult] = useState<any>(null);

    const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTransaction({
            ...transaction,
            [e.target.name]: e.target.value
        });
    };

    const performComplianceCheck = async () => {
        try {
            const response = await axios.post('/api/compliance/check', {
                userDetails,
                transaction
            });

            setComplianceResult(response.data);
        } catch (error) {
            console.error('Compliance check failed:', error);
            alert('Compliance check failed');
        }
    };

    return (
        <div>
            <h2>Compliance Check</h2>
            
            <div>
                <h3>User Details</h3>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Full Name"
                    value={userDetails.name}
                    onChange={handleUserDetailsChange}
                />
                <input 
                    type="text" 
                    name="nationality" 
                    placeholder="Nationality"
                    value={userDetails.nationality}
                    onChange={handleUserDetailsChange}
                />
                <input 
                    type="text" 
                    name="documentId" 
                    placeholder="Document ID"
                    value={userDetails.documentId}
                    onChange={handleUserDetailsChange}
                />
            </div>

            <div>
                <h3>Transaction Details</h3>
                <input 
                    type="number" 
                    name="amount" 
                    placeholder="Transaction Amount"
                    value={transaction.amount}
                    onChange={handleTransactionChange}
                />
                <input 
                    type="text" 
                    name="fromAddress" 
                    placeholder="From Address"
                    value={transaction.fromAddress}
                    onChange={handleTransactionChange}
                />
                <input 
                    type="text" 
                    name="toAddress" 
                    placeholder="To Address"
                    value={transaction.toAddress}
                    onChange={handleTransactionChange}
                />
                <select 
                    name="blockchain"
                    value={transaction.blockchain}
                    onChange={(e) => setTransaction({...transaction, blockchain: e.target.value})}
                >
                    <option value="ethereum">Ethereum</option>
                    <option value="polygon">Polygon</option>
                    <option value="solana">Solana</option>
                </select>
            </div>

            <button onClick={performComplianceCheck}>
                Check Compliance
            </button>

            {complianceResult && (
                <div>
                    <h3>Compliance Result</h3>
                    
                    <div>
                        <h4>KYC Check</h4>
                        <p>Passed: {complianceResult.kycCheck.passed ? 'Yes' : 'No'}</p>
                        {complianceResult.kycCheck.details.map((detail: string, index: number) => (
                            <p key={index}>{detail}</p>
                        ))}
                    </div>

                    <div>
                        <h4>Transaction Compliance</h4>
                        <p>Passed: {complianceResult.transactionCheck.passed ? 'Yes' : 'No'}</p>
                        {complianceResult.transactionCheck.risks.length > 0 && (
                            <div>
                                <h5>Risks Detected:</h5>
                                {complianceResult.transactionCheck.risks.map((risk: string, index: number) => (
                                    <p key={index}>{risk}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h4>Overall Compliance Report</h4>
                        <p>
                            Overall Compliance: 
                            {complianceResult.complianceReport.overallCompliance ? 'Passed' : 'Failed'}
                        </p>
                        <p>{complianceResult.complianceReport.summary}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplianceCheck;