import { forwardRef } from 'react';
import { Typography } from '@mui/material';
import { type Block } from '../types';
import './PrintableSchedule.css';

interface PrintableScheduleProps {
    date: string;
    blocks: Block[];
}

const PrintableSchedule = forwardRef<HTMLDivElement, PrintableScheduleProps>(({ date, blocks }, ref) => {

    const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })
        : 'Date not set';

    return (
        <div ref={ref} className="printable-schedule">

            <Typography variant="h5" className="printable-schedule__title">
                Program {formattedDate}
            </Typography>

            <table className="printable-schedule__table">
                <tbody>
                    {blocks.map((block) => (
                        <tr key={block.id} className="printable-schedule__row">

                            <td className="printable-schedule__time">
                                {block.time || ''}
                            </td>

                            <td className="printable-schedule__title-cell">
                                {block.title}
                            </td>

                            <td className="printable-schedule__details">

                                {block.details && (
                                    <span className="printable-schedule__details-text">{block.details}</span>
                                )}

                                {block.type === 'verse' && (
                                    <div className={block.details ? 'printable-schedule__versetto printable-schedule__versetto--with-details' : 'printable-schedule__versetto'}>

                                        {/* Versetti in linea separati da punto e virgola */}
                                        {block.verseReferences && block.verseReferences.length > 0 && (
                                            <div className="printable-schedule__verse-references">
                                                {block.verseReferences.map((v, i) => (
                                                    <span key={`verse-${i}`}>
                                                        {v.book} {v.chapter}:{v.verses}
                                                        {/* Aggiunge il separatore tranne che all'ultimo elemento */}
                                                        {i < block.verseReferences!.length - 1 ? '; ' : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Lettori in linea separati da virgola */}
                                        {block.readers && block.readers.length > 0 && (
                                            <div className="printable-schedule__readers">
                                                <span>Legge: </span>
                                                {block.readers.map((r, i) => (
                                                    <span key={`reader-${i}`}>
                                                        {r.name} ({r.languageLabel})
                                                        {/* Aggiunge il separatore tranne che all'ultimo elemento */}
                                                        {i < block.readers!.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
});

export default PrintableSchedule;