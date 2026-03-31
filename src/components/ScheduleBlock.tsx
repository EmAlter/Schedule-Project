import { useState, memo } from 'react';
import { Card, CardContent, TextField, Typography, Box, Button, Select, MenuItem, type SelectChangeEvent, InputLabel, FormControl, Chip, IconButton } from '@mui/material';
import { BIBLE_BOOKS, AVAILABLE_LANGUAGES } from '../utils/constants';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Block, VerseReference, Reader } from '../types';

interface ScheduleBlockProps {
    data: Block;
    onUpdate: (id: string, field: keyof Block, value: any) => void;
    onDelete: (id: string) => void;
    dragHandleProps?: any;
}

// MICRO-COMPONENTE ISOLATO 1: Evita il lag quando scrivi i capitoli
const VerseAdder = ({ onAdd }: { onAdd: (v: VerseReference) => void }) => {
    const [tempBook, setTempBook] = useState('Genesi');
    const [tempChapter, setTempChapter] = useState('');
    const [tempVerses, setTempVerses] = useState('');

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Book</InputLabel>
                <Select value={tempBook} label="Book" onChange={(e) => setTempBook(e.target.value)}>
                    {BIBLE_BOOKS.map(book => <MenuItem key={book} value={book}>{book}</MenuItem>)}
                </Select>
            </FormControl>
            <TextField label="Chap." size="small" sx={{ width: '80px' }} value={tempChapter} onChange={(e) => setTempChapter(e.target.value.replace(/\D/g, ''))} />
            <TextField label="Vers." size="small" sx={{ width: '80px' }} value={tempVerses} onChange={(e) => setTempVerses(e.target.value.replace(/[^0-9\-,]/g, ''))} placeholder="e.g. 1-3" />
            <Button variant="text" size="small" onClick={() => {
                if (!tempChapter || !tempVerses) return;
                onAdd({ book: tempBook, chapter: tempChapter, verses: tempVerses });
                setTempChapter('');
                setTempVerses('');
            }}>+ Add Verses</Button>
        </Box>
    );
};

// MICRO-COMPONENTE ISOLATO 2: Evita il lag quando scrivi il nome del lettore
const ReaderAdder = ({ onAdd }: { onAdd: (r: Reader) => void }) => {
    const [tempReaderName, setTempReaderName] = useState('');
    const [tempReaderLangCode, setTempReaderLangCode] = useState('it');
    const [tempReaderLangLabel, setTempReaderLangLabel] = useState('ITA');

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
                label="Reader Name" size="small"
                sx={{ flexGrow: 1, minWidth: '150px' }}
                value={tempReaderName}
                onChange={(e) => setTempReaderName(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Language</InputLabel>
                <Select value={tempReaderLangCode} label="Language" onChange={(e) => {
                    setTempReaderLangCode(e.target.value);
                    const selectedLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === e.target.value);
                    if (selectedLanguage) setTempReaderLangLabel(selectedLanguage.label);
                }}>
                    {AVAILABLE_LANGUAGES.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code} sx={{ display: 'flex', gap: 1 }}>
                            <img src={`https://flagcdn.com/w20/${lang.code}.png`} srcSet={`https://flagcdn.com/w40/${lang.code}.png 2x`} width="20" alt={lang.label} />
                            {lang.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="text" size="small" onClick={() => {
                if (!tempReaderName) return;
                onAdd({ name: tempReaderName, languageCode: tempReaderLangCode, languageLabel: tempReaderLangLabel });
                setTempReaderName('');
            }}>+ Add Reader</Button>
        </Box>
    );
};

// COMPONENTE PRINCIPALE
function ScheduleBlock({ data, onUpdate, onDelete, dragHandleProps }: ScheduleBlockProps) {

    const DragHandle = () => (
        <IconButton {...dragHandleProps} sx={{ position: 'absolute', top: 4, right: 4, cursor: 'grab', padding: '12px', touchAction: 'none' }}>
            <OpenWithIcon color="action" fontSize="small" />
        </IconButton>
    );

    const handleTypeChange = (event: SelectChangeEvent) => {
        onUpdate(data.id, 'type', event.target.value);
    };

    const TypeSelector = () => (
        <Box sx={{ mb: 1 }}>
            <Select
                value={data.type || 'standard'}
                onChange={handleTypeChange}
                size="small"
                variant="standard"
                disableUnderline
                sx={{
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: 'text.secondary',
                    textTransform: 'uppercase'
                }}
            >
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="song">Song</MenuItem>
                <MenuItem value="verse">Verse</MenuItem>
            </Select>
        </Box>
    );

    const renderCardContent = () => {
        if (data.type === 'verse') {
            return (
                <Card variant="outlined" sx={{ backgroundColor: '#e8f5e9', borderLeft: '6px solid #4caf50', height: '100%', position: 'relative' }}>
                    <DragHandle />
                    <IconButton onClick={() => onDelete(data.id)} sx={{ position: 'absolute', top: 4, right: 40, padding: '12px' }}>
                        <DeleteIcon color="error" fontSize="small" />
                    </IconButton>
                    <CardContent sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        pt: 2, // Ridotto per far spazio al selettore
                        pr: { xs: 6, sm: 10 }
                    }}>
                        <TypeSelector />

                        {/* INPUT OPTIMIZED: defaultValue + onBlur instead of value + onChange */}
                        <TextField
                            label="Segment Title (e.g. Bible Reading)"
                            variant="outlined" size="small" fullWidth
                            defaultValue={data.title}
                            onBlur={(e) => onUpdate(data.id, 'title', e.target.value)}
                            InputProps={{ sx: { fontWeight: 'bold' } }}
                        />

                        {data.verseReferences && data.verseReferences.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {data.verseReferences.map((v, index) => (
                                    <Chip key={index} label={`${v.book} ${v.chapter}:${v.verses}`} onDelete={() => {
                                        const currentVerses = data.verseReferences || [];
                                        onUpdate(data.id, 'verseReferences', currentVerses.filter((_, idx) => idx !== index));
                                    }} color="success" variant="outlined" />
                                ))}
                            </Box>
                        )}

                        <VerseAdder onAdd={(verse) => onUpdate(data.id, 'verseReferences', [...(data.verseReferences || []), verse])} />

                        {data.readers && data.readers.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {data.readers.map((r, index) => (
                                    <Chip key={index} avatar={<img src={`https://flagcdn.com/w20/${r.languageCode}.png`} alt={r.languageLabel} />} label={`${r.languageLabel} ${r.name}`} onDelete={() => {
                                        const currentReaders = data.readers || [];
                                        onUpdate(data.id, 'readers', currentReaders.filter((_, idx) => idx !== index));
                                    }} color="primary" variant="outlined" />
                                ))}
                            </Box>
                        )}

                        <ReaderAdder onAdd={(reader) => onUpdate(data.id, 'readers', [...(data.readers || []), reader])} />

                        <TextField
                            label="Additional information (optional)"
                            variant="outlined" size="small" multiline rows={2} fullWidth
                            defaultValue={data.details || ''}
                            onBlur={(e) => onUpdate(data.id, 'details', e.target.value)}
                            sx={{ mt: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'flex-end' }}>Last modified by: {data.lastModifiedBy}</Typography>
                    </CardContent>
                </Card>
            );
        }

        const getCardStyle = () => data.type === 'song' ? { backgroundColor: '#f3e5f5', borderLeft: '6px solid #9c27b0' } : { backgroundColor: '#ffffff', borderLeft: '6px solid #9e9e9e' };

        return (
            <Card variant="outlined" sx={{ ...getCardStyle(), height: '100%', position: 'relative' }}>
                <DragHandle />
                <IconButton onClick={() => onDelete(data.id)} sx={{ position: 'absolute', top: 4, right: 40, padding: '12px' }}>
                    <DeleteIcon color="error" fontSize="small" />
                </IconButton>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, pr: 10 }}>
                    <TypeSelector />

                    <TextField
                        label={data.type === 'song' ? "Segment (e.g. Congregation standing song)" : "Segment (e.g. Welcome)"}
                        variant="outlined" size="small" fullWidth
                        defaultValue={data.title}
                        onBlur={(e) => onUpdate(data.id, 'title', e.target.value)}
                        InputProps={{ sx: { fontWeight: 'bold' } }}
                    />
                    <TextField
                        label={data.type === 'song' ? "Song Name (e.g. 549 - Symbolum)" : "Description (e.g. presented by John Doe)"}
                        variant="outlined" size="small" multiline rows={2} fullWidth
                        defaultValue={data.details || ''}
                        onBlur={(e) => onUpdate(data.id, 'details', e.target.value)}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'flex-end' }}>Last modified by: {data.lastModifiedBy}</Typography>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ display: 'flex', gap: '16px', marginBottom: '12px', alignItems: 'stretch' }}>
            <Box sx={{ width: '80px', flexShrink: 0, pt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {data.time !== undefined ? (
                    <>
                        <TextField
                            type="time" variant="standard"
                            defaultValue={data.time}
                            onBlur={(e) => onUpdate(data.id, 'time', e.target.value)}
                            InputProps={{ disableUnderline: true, sx: { fontSize: '1.2rem', fontWeight: 'bold' } }}
                        />
                        <Button size="small" color="error" sx={{ fontSize: '0.6rem', mt: 0.5, p: 0, minWidth: 'auto' }} onClick={() => onUpdate(data.id, 'time', undefined)}>Remove</Button>
                    </>
                ) : (
                    <Button variant="text" size="small" sx={{ fontSize: '0.7rem', textAlign: 'center', lineHeight: 1.2, color: 'text.secondary' }} onClick={() => onUpdate(data.id, 'time', '10:00')}>+ Add<br />Time</Button>
                )}
            </Box>
            <Box sx={{ flexGrow: 1 }}>{renderCardContent()}</Box>
        </Box>
    );
}

// 3. LA BLINDATURA: Questo componente si ricaricherà SOLO se i suoi dati specifici cambiano.
export default memo(ScheduleBlock, (prev, next) => prev.data === next.data);