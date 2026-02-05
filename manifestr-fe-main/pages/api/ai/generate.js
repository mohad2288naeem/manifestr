export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Relaxed validation - just return success to unblock the UI flow
    const { prompt, output } = req.body;

    // Generate a simple ID for redirection
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate network delay for "Creating..." animation
    setTimeout(() => {
        res.status(200).json({
            status: "success",
            message: "Job created successfully",
            data: {
                jobId: jobId,
                status: "pending"
            }
        });
    }, 1500);
}
