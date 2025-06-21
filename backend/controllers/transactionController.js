const Transaction = require('../models/Transaction');

const confirmTransaction = async (req, res) => {
    const { transactionId, transactionHash } = req.body;

    if (!transactionId || !transactionHash) {
        return res.status(400).json({ success: false, message: 'Transaction ID and hash are required.' });
    }

    try {
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found.' });
        }

        transaction.status = 'success';
        transaction.transaction_hash = transactionHash;
        transaction.response_message = `Transaction successfully broadcasted with hash: ${transactionHash}`;
        
        await transaction.save();

        res.status(200).json({ success: true, message: 'Transaction confirmed successfully.', data: transaction });

    } catch (error) {
        console.error("Error confirming transaction:", error);
        res.status(500).json({ success: false, message: 'Failed to confirm transaction.', error: error.message });
    }
};

module.exports = {
    confirmTransaction,
}; 