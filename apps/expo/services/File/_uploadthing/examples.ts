// // @ts-ignore
// const documentUploader = useDocumentUpload<UploadRouter>({
//     onUploadBegin: () => setIsFileUploading(true),
//     onClientUploadComplete: (res) => {
//         setIsFileUploading(false)
//         postFiles.mutate(
//             res.map((file) => ({
//                 mimeType: file.type,
//                 name: file.name,
//                 mbSize: file.size,
//                 url: file.url,
//             }))
//         )
//     },
//     endpoint: "document",
// })

// // @ts-ignore
// const imageUploader = useImageUpload<UploadRouter>({
//     onUploadBegin: () => setIsFileUploading(true),
//     onClientUploadComplete: (res) => {
//         setIsFileUploading(false)
//         postFiles.mutate(
//             res.map((file) => ({
//                 mimeType: file.type,
//                 name: file.name,
//                 mbSize: file.size,
//                 url: file.url,
//             }))
//         )
//     },
//     endpoint: "videoAndImage",
// })
