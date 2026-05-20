import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Box, useTheme } from '@mui/material';

type TicketQrCodeProps = {
    ticketCode: string;
    size?: number;
};

export function TicketQRCode({ ticketCode, size = 256 }: TicketQrCodeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const theme = useTheme();

    useEffect(() => {
        if (!canvasRef.current) return;

        QRCode.toCanvas(canvasRef.current, ticketCode, {
            width: size,
            errorCorrectionLevel: 'H',
            margin: 1,
            color: {
                dark: theme.palette.text.primary,
                light: theme.palette.background.paper,
            },
        }, (error) => {
            if (error) {
                console.error('Error generating QR code:', error);
            }
        });
    }, [ticketCode, size]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    border: `3px solid ${theme.palette.primary.light}`,
                    borderRadius: '8px',
                    padding: '8px',
                    backgroundColor: theme.palette.background.paper,
                }}
            />
        </Box>
    );
}
