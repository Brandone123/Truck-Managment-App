import ApexCharts from "apexcharts";

interface ChartImage {
    imgURI?: string;
    blob?: Blob
}

 export default async function generateChartImage(chartOptions: ApexCharts.ApexOptions) {

    let container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    // Create ApexCharts instance
    const chart = new ApexCharts(
        container, // Pass null as the first parameter to prevent rendering in the DOM
        chartOptions
    ) as ApexCharts;

    // Render the chart
    const { imgURI, blob } = await renderChart(chart)

    // Remove the chart container from the DOM
    container.remove()

    return imgURI as string
}

function renderChart(chart: ApexCharts) {
    return new Promise<ChartImage>((resolve, reject) => {
        chart.render().then(() => {
            window.setTimeout(function () {
                // Generate image //reference: https://apexcharts.com/docs/methods/#dataURI
                chart.dataURI().then((uri: ChartImage) => {
                    resolve(uri)
                })
            }, 1000)
        })
    })
}

export function getBase64ImageDimensions(base64Image: string) {
    return new Promise<{ naturalWidth: number, naturalHeight: number }>((resolve, reject) => {
        const image = new Image();
        image.onload = function () {
            const { naturalWidth, naturalHeight } = image;
            resolve({ naturalWidth, naturalHeight });
        };

        image.onerror = function () {
            console.log(this)
            reject(new Error('Failed to load image.'));
        };

        image.src = base64Image;
    });
}