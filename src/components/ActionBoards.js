import React from 'react';
import {
  Modal, Box, Typography, Checkbox,
  Button, IconButton, FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const BoardSelectionModal = ({ open, onClose, onSubmit, boardList, selectedBoards, setSelectedBoards, action }) => {
  const handleToggleBoard = (id) => {
    setSelectedBoards(prev => 
      prev.includes(id) ? prev.filter(boardId => boardId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedBoards);
    onClose();
  };

  const actionString = action === 'copy' ? '복사' : '이동';

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="board-selection-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="board-selection-modal-title" variant="h6" component="h2">
            게시물 {actionString}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mb: 3 }}>
          {boardList.map((board) => (
            <div key={board.bo_table}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedBoards.includes(board.bo_table)}
                    onChange={() => handleToggleBoard(board.bo_table)}
                    name={board.bo_table}
                  />
                }
                label={
                  <Typography color={board.highlight ? 'error' : 'textPrimary'}>
                    {board.bo_subject}
                  </Typography>
                }
              />
            </div>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} variant="outlined">
            취소하기
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {actionString}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};