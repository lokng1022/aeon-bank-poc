import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import {
  PdfSharingUnavailableError,
  shareReceiptPdf,
} from '@/services/receiptShareService';

jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(),
  shareAsync: jest.fn(),
}));

jest.mock('expo-file-system/legacy', () => ({
  cacheDirectory: 'file:///app/cache/',
  EncodingType: {
    Base64: 'base64',
  },
  writeAsStringAsync: jest.fn(),
}));

const html = '<html><body>Receipt</body></html>';
const title = 'Share PDF receipt';
const cachedUri =
  'file:///app/cache/AEON-Receipt-1730000000000.pdf';

beforeEach(() => {
  jest.replaceProperty(Platform, 'OS', 'android');
  jest.spyOn(Date, 'now').mockReturnValue(1730000000000);

  jest.mocked(Sharing.isAvailableAsync)
    .mockReset()
    .mockResolvedValue(true);

  jest.mocked(Sharing.shareAsync)
    .mockReset()
    .mockResolvedValue(undefined);

  jest.mocked(FileSystem.writeAsStringAsync)
    .mockReset()
    .mockResolvedValue(undefined);

  jest.mocked(Print.printToFileAsync)
    .mockReset()
    .mockResolvedValue({
      uri: 'file:///unreadable/Print/original.pdf',
      numberOfPages: 1,
      base64: 'JVBERi0xLjcK',
    });
});

describe('PDF receipt sharing', () => {
  it('shares the PDF written into the app cache', async () => {
    await shareReceiptPdf(html, title);

    expect(Print.printToFileAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        html,
        base64: true,
      }),
    );

    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      cachedUri,
      'JVBERi0xLjcK',
      { encoding: 'base64' },
    );

    expect(Sharing.shareAsync).toHaveBeenCalledWith(cachedUri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: title,
    });
  });

  it('stops before generating a PDF when sharing is unavailable', async () => {
    jest.mocked(Sharing.isAvailableAsync).mockResolvedValue(false);

    await expect(
      shareReceiptPdf(html, title),
    ).rejects.toBeInstanceOf(PdfSharingUnavailableError);

    expect(Print.printToFileAsync).not.toHaveBeenCalled();
    expect(Sharing.shareAsync).not.toHaveBeenCalled();
  });

  it('does not share when writing the PDF fails', async () => {
    const error = new Error('Unable to write PDF');

    jest.mocked(FileSystem.writeAsStringAsync)
      .mockRejectedValue(error);

    await expect(
      shareReceiptPdf(html, title),
    ).rejects.toBe(error);

    expect(Sharing.shareAsync).not.toHaveBeenCalled();
  });

  it('does not write or share a PDF with missing content', async () => {
    jest.mocked(Print.printToFileAsync).mockResolvedValue({
      uri: 'file:///unreadable/Print/original.pdf',
      numberOfPages: 1,
    });

    await expect(
      shareReceiptPdf(html, title),
    ).rejects.toThrow('PDF_GENERATION_FAILED');

    expect(FileSystem.writeAsStringAsync).not.toHaveBeenCalled();
    expect(Sharing.shareAsync).not.toHaveBeenCalled();
  });

  it('propagates native sharing errors for the screen to display', async () => {
    const error = new Error('Native sharing failed');

    jest.mocked(Sharing.shareAsync).mockRejectedValue(error);

    await expect(
      shareReceiptPdf(html, title),
    ).rejects.toBe(error);
  });
});