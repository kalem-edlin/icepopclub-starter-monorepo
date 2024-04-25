const processAndUpload = (assets: ImagePickerAsset[] | DocumentPickerAsset[], uploadthing: UseUploadThingType) => {
    const files = await Promise.all(
        assets.map(async (a) => {
            const blob = await fetch(a.uri).then((r) => r.blob());
            const n = a.name ?? a.uri.split("/").pop() ?? "unknown-filename";
            const file = new File([blob], n, {
            type: a.mimeType ?? "application/octet-stream",
            });
            const RNFormDataCompatibleFile = Object.assign(file, { uri: a.uri });
            return RNFormDataCompatibleFile;
        }),
        );

        // use upload thing hook to start the upload
        return {
            uploadthing.startUpload(
            files as unknown as File[],
            "input" in opts ? opts.input : undefined,
        )

}

const useFileUpload = (initOpts: { url: URL }) => {
    const {useUploadThing} = generateReactHelpers()
    const uploadthing = useUploadThing(endpoint, opts);
    const { fileTypes, multiple } = () => {
    const generatePermittedFileTypes(config) => {
        // Forward mime-types from route config
    const allowedMimeTypes: string[] = fileTypes;
  
    // Handle special UploadThing types
    if (fileTypes.includes("image")) allowedMimeTypes.push("image/*");
    if (fileTypes.includes("video")) allowedMimeTypes.push("video/*");
    if (fileTypes.includes("audio")) allowedMimeTypes.push("audio/*");
    if (fileTypes.includes("pdf")) allowedMimeTypes.push("application/pdf");
    if (fileTypes.includes("text")) allowedMimeTypes.push("text/*");
  
    if (fileTypes.includes("blob")) {
      allowedMimeTypes.push("&ast;/*");
      allowedMimeTypes.push("*/*");
    }
  
    return { mimeTypes: allowedMimeTypes, multiple };
        };

    

    return { generatePermittedFileTypes(config), processAndUpload: () => processAndUpload(assets, useUploadThing)}

}

const useImageUpload = (initOpts: { url: URL }) => {
    const {useUploadThing} = generateReactHelpers()
    const uploadthing = useUploadThing(endpoint, opts);

    const  generatePermittedImageTypes = (config) =>  {
        const { fileTypes, multiple } = generatePermittedFileTypes(config);
    const allowsImg = fileTypes.some((t) => t.startsWith("image"));
    const allowsVid = fileTypes.some((t) => t.startsWith("video"));
  
    let mediaTypes: ImagePicker.MediaTypeOptions | undefined = undefined;
    if (allowsImg && allowsVid) mediaTypes = ImagePicker.MediaTypeOptions.All;
    else if (allowsImg) mediaTypes = ImagePicker.MediaTypeOptions.Images;
    else if (allowsVid) mediaTypes = ImagePicker.MediaTypeOptions.Videos;
  
    return { mediaTypes, multiple };
    }
    
    return { generatePermittedImageTypes(),processAndUpload: () => processAndUpload(assets, useUploadThing)}

}
