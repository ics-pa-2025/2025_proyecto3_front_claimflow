/**
 * Export utilities for dashboard charts and data
 */

/**
 * Convert array of objects to CSV format
 */
export const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Escape commas and quotes in values
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Export chart as PNG image using html2canvas approach
 * For Recharts, we'll use the SVG element directly
 */
export const exportChartAsImage = (chartContainerId: string, filename: string) => {
    const container = document.getElementById(chartContainerId);
    if (!container) {
        console.error(`Chart container with id "${chartContainerId}" not found`);
        return;
    }

    // Find the SVG element within the container
    const svg = container.querySelector('svg');
    if (!svg) {
        console.error('SVG element not found in chart container');
        return;
    }

    // Get SVG dimensions
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
        // Set canvas size to match SVG
        canvas.width = img.width;
        canvas.height = img.height;

        // Fill white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw SVG image
        ctx.drawImage(img, 0, 0);

        // Convert to PNG and download
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Failed to create image blob');
                return;
            }

            const link = document.createElement('a');
            link.download = `${filename}.png`;
            link.href = URL.createObjectURL(blob);
            link.click();

            URL.revokeObjectURL(url);
        });
    };

    img.src = url;
};
