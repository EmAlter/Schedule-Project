import { useState, useCallback, memo, type MouseEvent } from 'react';
import { Button, Box, Menu, MenuItem } from '@mui/material';
import ScheduleBlock from './ScheduleBlock';
import { type Block, type BlockType } from '../types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ScheduleListProps {
    blocks: Block[];
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}

// 1. SortableBlock component optimized with memo to avoid unnecessary re-renders
const SortableBlock = memo(({ block, onUpdate, onDelete }: { block: Block, onUpdate: any, onDelete: any }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

    const dndStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={dndStyle}>
            <ScheduleBlock
                data={block}
                onUpdate={onUpdate}
                onDelete={onDelete}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
});

export default function ScheduleList({ blocks, setBlocks }: ScheduleListProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleAddBlock = (type: BlockType) => {
        let defaultTitle = '';
        if (type === 'song') defaultTitle = 'Song Title';
        if (type === 'verse') defaultTitle = 'Verse Reference';

        const newBlock: Block = {
            id: crypto.randomUUID(),
            type: type,
            title: defaultTitle,
            lastModifiedBy: localStorage.getItem('userName') || 'Anonymous',
        };

        setBlocks([...blocks, newBlock]);
        handleMenuClose();
    };

    // 2. Memoized handlers to prevent re-creation on every render, which can cause unnecessary re-renders of child components
    const handleUpdateBlock = useCallback((id: string, field: keyof Block, value: any) => {
        setBlocks(prev => prev.map(block =>
            block.id === id ? { ...block, [field]: value, lastModifiedBy: localStorage.getItem('userName') || 'Anonymous' } : block
        ));
    }, [setBlocks]);

    const handleDeleteBlock = useCallback((id: string) => {
        setBlocks(prev => prev.filter(block => block.id !== id));
    }, [setBlocks]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    {blocks.map((block) => (
                        <SortableBlock
                            key={block.id}
                            block={block}
                            onUpdate={handleUpdateBlock}
                            onDelete={handleDeleteBlock}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <Button variant="contained" color="primary" onClick={handleMenuClick} sx={{ alignSelf: 'flex-start' }}>
                Add Block
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleAddBlock('standard')}>Add Event</MenuItem>
                <MenuItem onClick={() => handleAddBlock('song')}>Add Song</MenuItem>
                <MenuItem onClick={() => handleAddBlock('verse')}>Add Verse</MenuItem>
            </Menu>
        </Box>
    );
}