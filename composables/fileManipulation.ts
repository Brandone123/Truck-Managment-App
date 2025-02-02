type FileIconMapping = {
    icon: string;
    color: string;
};

// Define the mapping of extensions to icons and colors
const extensionMapping: Record<string, FileIconMapping> = {
    pdf: { icon: "mdi-file-pdf-box", color: "red" },
    doc: { icon: "mdi-file-word", color: "blue" },
    docx: { icon: "mdi-file-word", color: "blue" },
    xls: { icon: "mdi-file-excel", color: "green" },
    xlsx: { icon: "mdi-file-excel", color: "green" },
    // csv: { icon: "mdi-file-delimited", color: "green" },
    ppt: { icon: "mdi-file-powerpoint", color: "red" },
    pptx: { icon: "mdi-file-powerpoint", color: "red" },
    png: { icon: "mdi-image", color: "purple" },
    jpg: { icon: "mdi-image", color: "orange" },
    jpeg: { icon: "mdi-image", color: "orange" },
    gif: { icon: "mdi-image", color: "pink" },
    mp4: { icon: "mdi-video", color: "teal" },
    mp3: { icon: "mdi-music", color: "yellow" },
    // txt: { icon: "mdi-file-document-outline", color: "gray" },
    zip: { icon: "mdi-archive", color: "brown" },
    rar: { icon: "mdi-archive", color: "brown" },
    unknown: { icon: "mdi-file-question", color: "black" },
};


/**
 * A map of file categories to their recognized extensions.
 * Add/remove extensions or categories as you wish.
 */
const extensionCategories: Record<string, string[]> = {
    video: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'],
    image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'],
    audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'],
    document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
    // Add more categories as needed
}


export function getFileExtension(fileName: string): string {
    return fileName.split(".").pop()?.toLowerCase() || "unknown";
}
/**
 * Splice the file name to extract the extension and map it to an icon and color.
 * @param fileName - The name of the file.
 * @returns An object containing the icon and color based on the file extension.
 */
export function getFileIconAndColor(fileName: string): FileIconMapping {
    // Extract the file extension
    const extension = getFileExtension(fileName)

    // Get the mapping for the extension or default if not found
    return extensionMapping[extension] || extensionMapping["unknown"];
}

/**
 * Return a string indicating the file category based on the filename's extension.
 * If no match is found, returns 'unknown'.
 */
export function getFileType(fileName: string): string {
    const extension = getFileExtension(fileName)

    if (extension == 'unknown') {
        return 'unknown'
    }

    // 2. Search for extension in our categories
    for (const [category, extensions] of Object.entries(extensionCategories)) {
        if (extensions.includes(extension)) {
            return category; // e.g. 'video' or 'photo'
        }
    }

    // 3. Default to 'unknown' if no match
    return 'unknown';
}
