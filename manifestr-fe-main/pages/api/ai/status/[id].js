export default function handler(req, res) {
    const { id } = req.query

    if (!id) {
        return res.status(400).json({ message: 'Missing Job ID' })
    }

    // extract start time from "job_{timestamp}_{random}"
    const parts = id.split('_')
    if (parts.length < 2) {
        return res.status(400).json({ message: 'Invalid Job ID format' })
    }

    const startTime = parseInt(parts[1], 10)
    const elapsed = Date.now() - startTime

    // Define phases in milliseconds
    // 0-2s: QUEUED
    // 2-5s: PROCESSING_INTENT
    // 5-8s: PROCESSING_LAYOUT
    // 8-12s: PROCESSING_CONTENT
    // 12-14s: CRITIQUING
    // 14-16s: RENDERING
    // >16s: COMPLETED

    let status = 'QUEUED'
    let message = 'In queue...'

    if (elapsed < 2000) {
        status = 'QUEUED'
        message = 'Job queued for processing...'
    } else if (elapsed < 5000) {
        status = 'PROCESSING_INTENT'
        message = 'Analyzing user intent and requirements...'
    } else if (elapsed < 8000) {
        status = 'PROCESSING_LAYOUT'
        message = 'Structuring document layout and flow...'
    } else if (elapsed < 12000) {
        status = 'PROCESSING_CONTENT'
        message = 'Generating detailed content blocks...'
    } else if (elapsed < 14000) {
        status = 'CRITIQUING'
        message = 'AI Agent reviewing for consistency and tone...'
    } else if (elapsed < 16000) {
        status = 'RENDERING'
        message = 'Finalizing visual output...'
    } else {
        status = 'COMPLETED'
        message = 'Generation complete!'
    }

    res.status(200).json({
        id,
        status,
        message
    })
}
