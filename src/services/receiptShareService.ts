import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export class PdfSharingUnavailableError extends Error {
    constructor() {
        super('PDF_SHARING_UNAVAILABLE');
        this.name = 'PdfSharingUnavailableError';
    }
}

export async function shareReceiptPdf(
    html: string,
    title: string,
): Promise<void> {
    if (Platform.OS === 'web' || !(await Sharing.isAvailableAsync())) {
        throw new PdfSharingUnavailableError();
    }

    const cacheDirectory = FileSystem.cacheDirectory;

    if (!cacheDirectory) {
        throw new Error('PDF_CACHE_UNAVAILABLE');
    }

    const { base64 } = await Print.printToFileAsync({
        html,
        width: 595,
        height: 842,
        base64: true,
    });

    if (!base64) {
        throw new Error('PDF_GENERATION_FAILED');
    }

    const receiptUri =
        `${cacheDirectory}AEON-Receipt-${Date.now()}.pdf`;

    await FileSystem.writeAsStringAsync(receiptUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(receiptUri, {
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
        dialogTitle: title,
    });
}