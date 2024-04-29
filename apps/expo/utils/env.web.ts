// Needed so env validation does not happen on web where no env variables are necessary.

const env = process.env
export { env }
