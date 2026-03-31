import { useState, useEffect, startTransition } from 'react';
import { Box, Card, CardActionArea, Typography, Container, IconButton, CircularProgress, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { storageAPI } from '../utils/storage';

type Schedule = {
    id: string;
    date?: string | number | Date;
    subtitle?: string;
    [key: string]: unknown;
};

export default function Home() {
    const navigate = useNavigate();
    const [savedSchedules, setSavedSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [anchorElAdd, setAnchorElAdd] = useState<null | HTMLElement>(null);

    const handleOpenAddMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElAdd(event.currentTarget);
    };

    const handleCloseAddMenu = () => {
        setAnchorElAdd(null);
    };

    const handleCreateNew = (template: 'default' | 'empty') => {
        handleCloseAddMenu();
        startTransition(() => {
            navigate(`/editor/new?template=${template}`);
        });
    };

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const schedulesData = await storageAPI.getSchedules();

                // Sort schedules from newest to oldest by date
                const getDateMs = (value: any) => (value ? new Date(value).getTime() : 0);
                schedulesData.sort((a, b) => getDateMs(b.date) - getDateMs(a.date));
                setSavedSchedules(schedulesData);
            } catch (error) {
                console.error("Error loading schedules:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, []);

    // Delete the schedule from database and update UI
    const handleDelete = async (e: React.MouseEvent, idToRemove: string) => {
        e.stopPropagation();

        if (window.confirm("Are you sure you want to delete this schedule?")) {
            try {
                await storageAPI.deleteSchedule(idToRemove);
                setSavedSchedules(savedSchedules.filter(schedule => schedule.id !== idToRemove));
            } catch (error) {
                console.error("Error deleting schedule:", error);
                alert("Error while deleting.");
            }
        }
    };

    const handleDuplicate = async (scheduleToCopy: any) => {
        try {
            const newId = crypto.randomUUID();

            const duplicatedSchedule = {
                ...scheduleToCopy,
                id: newId,
                updatedAt: new Date().toISOString()
            };

            await storageAPI.saveSchedule(duplicatedSchedule);

            setSavedSchedules((prevSchedules) => [
                duplicatedSchedule,
                ...prevSchedules
            ]);

        } catch (error) {
            console.error("Error duplicating schedule:", error);
            alert("An error occurred while duplicating the schedule.");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Schedule Archive
            </Typography>

            {/* Show spinner while loading schedules */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 3 }}>

                    <Card variant="outlined" sx={{ aspectRatio: '1 / 1', backgroundColor: '#f5f5f5', borderStyle: 'dashed', borderWidth: 2 }}>
                        <CardActionArea
                            onClick={handleOpenAddMenu}
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <AddIcon color="primary" sx={{ fontSize: 60, mb: 1 }} />
                            <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                New Schedule
                            </Typography>
                        </CardActionArea>
                    </Card>

                    <Menu
                        anchorEl={anchorElAdd}
                        open={Boolean(anchorElAdd)}
                        onClose={handleCloseAddMenu}
                    >
                        <MenuItem onClick={() => handleCreateNew('default')}>Use Standard Template</MenuItem>
                        <MenuItem onClick={() => handleCreateNew('empty')}>Blank Schedule</MenuItem>
                    </Menu>

                    {savedSchedules.map((schedule) => (
                        <Card key={schedule.id} variant="outlined" sx={{ aspectRatio: '1 / 1', display: 'flex', flexDirection: 'column', position: 'relative', transition: '0.2s', '&:hover': { borderColor: 'primary.main', boxShadow: 2 } }}>

                            {/* Delete button (top-right) */}
                            <IconButton
                                onClick={(e) => handleDelete(e, schedule.id)}
                                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, backgroundColor: 'rgba(255,255,255,0.8)' }}
                                size="small" color="error"
                                title="Delete schedule"
                            >
                                <DeleteIcon />
                            </IconButton>

                            {/* Main clickable area to open the schedule editor */}
                            <CardActionArea
                                onClick={() => { startTransition(() => { navigate(`/editor/${schedule.id}`); }); }}
                                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', px: 2 }}
                            >
                                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                                    {schedule.date ? new Date(schedule.date).toLocaleDateString('en-US') : 'No date'}
                                </Typography>

                                {schedule.subtitle && (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {schedule.subtitle}
                                    </Typography>
                                )}
                            </CardActionArea>

                            {/* Duplicate button (bottom-right) */}
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicate(schedule);
                                }}
                                sx={{ position: 'absolute', bottom: 8, right: 8, zIndex: 2, backgroundColor: 'rgba(255,255,255,0.8)' }}
                                size="small" color="primary"
                                title="Duplicate schedule"
                            >
                                <ContentCopyIcon />
                            </IconButton>
                        </Card>
                    ))}

                </Box>
            )}
        </Container>
    );
}