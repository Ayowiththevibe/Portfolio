const sendemail = require('../utils/email')

const sendEmailcontroller = async (req, res) => {
    const {email, subject, message} = req.body
    try {
        if (!email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' })
        }
        await sendemail(email, subject, message)
        res.status(200).json({ message: 'Email sent successfully'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Failed to send email'})
        
        
    }
}
module.exports = {sendEmailcontroller}