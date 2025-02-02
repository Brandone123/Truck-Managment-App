export function convertToCSV(data: any[], headers: any[], processedHeader?: boolean) {
    // Extract header titles and keys

    const headerTitles = processedHeader ? headers[0] : headers.filter(header => !header.disabled).map(header => header.title)
    const headerKeys = processedHeader ? headers[1] : headers.filter(header => !header.disabled).map(header => header.key); // Assuming each header has a key for the data field

    // Create the CSV rows starting with the header row
    const csvRows = [headerTitles.join(',')];

    // Iterate over each data item and map values according to header keys
    data.forEach(item => {
        const csvValues = headerKeys.map((key: string) => {
            // Ensure the value matches the header key order
            var value = item[key] !== undefined ? item[key] : ""; // Use empty string if undefined
            // Escape quotes by doubling them, surround value with quotes if it contains a comma or a quote
            if (typeof value == 'string') {
                if (value.includes('"')) {
                    value = `"${value.replace(/"/g, '""')}"`
                }
                if (value.includes(',') || value.includes('\n') || value.includes('\r')) {
                    value = `"${value}"`;
                }
            }
            return value
        });
        csvRows.push(csvValues.join(','));
    });
    return csvRows.join('\n');
}


export function downloadCSVFile(data: any, filename: any) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function parseCSV(text: string) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const data = lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        return headers.reduce((acc, header, index) => {
            acc[header.charAt(0).toLowerCase() + header.slice(1)] = values[index];
            return acc;
        }, {});
    });
    return data;
};