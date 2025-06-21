const User = require('../models/User');

const linkUser = async (req, res) => {
    const { email, walletAddress } = req.body;

    if (!email || !walletAddress) {
        return res.status(400).json({ success: false, message: 'Email and wallet address are required.' });
    }

    try {
        const lowercasedAddress = walletAddress.toLowerCase();

        // Find a user by email
        let user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            // If user exists, add the new wallet address if it's not already there
            if (!user.walletAddresses.includes(lowercasedAddress)) {
                user.walletAddresses.push(lowercasedAddress);
                await user.save();
                return res.status(200).json({ success: true, message: 'Wallet address added to existing user.', data: user });
            } else {
                return res.status(200).json({ success: true, message: 'User and wallet address link already exists.', data: user });
            }
        } else {
            // If user does not exist, create a new one
            const newUser = new User({
                email,
                walletAddresses: [lowercasedAddress],
            });
            await newUser.save();
            return res.status(201).json({ success: true, message: 'New user created and wallet linked.', data: newUser });
        }
    } catch (error) {
        console.error("Error linking user:", error);
        res.status(500).json({ success: false, message: 'Failed to link user.', error: error.message });
    }
};

module.exports = {
    linkUser,
}; 