import * as React from 'react';
import { useState } from "react";
import {
  Toolbar,
  AppBar,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Card,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemIcon,
  Snackbar
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Container, Draggable, DropResult } from "react-smooth-dnd";
import { arrayMoveImmutable } from "array-move";
import CopyToClipBoard from 'react-copy-to-clipboard';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const defaultColors = ['#C7000B', '#D28300', '#DFD000', '#00873C', '#005AA0', '#181878', '#800072'];
  const [items, setItems] = useState(
    defaultColors.map((value, index) => {
      return {id: index, text: value}
    })
  );
  const [isCheckedColor, setIsCheckedColor] = useState(false);
  const [preText, setPreText] = useState("");
  const [resultText, setResultText] = useState("");
  const [open, setOpen] = useState(false);

  const onDrop = (dropResult: DropResult) => {
    const { removedIndex, addedIndex } = dropResult;
    setItems((itemsArray) =>
      arrayMoveImmutable(itemsArray, removedIndex || 0, addedIndex || 0)
    );
  };

  const onChangeColorBox = (event: any) => {
    setIsCheckedColor(event.target.checked);
  }

  const onChangeColorField = (event: any) => {
    setItems(items.map((value) => {
      return {
        id: value.id,
        text: value.id === Number(event.target.id) ? event.target.value : value.text
      };
    }));
  }
  
  const onChangePreText = (event: any) => {
    setPreText(event.target.value);
  }

  const onClickButton = () => {
    var result = "";
    var color = isCheckedColor ? items.map((value) => { return value.text }) : defaultColors;

    preText.split('').forEach((char, index) => {
      result += `[color=${color[index % color.length]}]${char}[/color]`;
    });
    
    setResultText(result);
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            ロドスト日記の文字を虹色にするツール
          </Typography>
        </Toolbar>
      </AppBar>

      <Card sx={{ m: 2 }}>
        <Box sx={{ padding: 2 }}>
          <TextField
            sx={{ width: 1 }}
            id="pre-text"
            label="変換するテキスト"
            multiline
            rows={4}
            value={preText}
            onChange={onChangePreText}
          />
        </Box>
      </Card>

      <Card sx={{ m: 2 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>カスタマイズ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked={false} onChange={onChangeColorBox}/>} label="色をカスタマイズする" />
            </FormGroup>
          </AccordionDetails>
          <AccordionDetails sx={{display: isCheckedColor ? '' : 'none'}}>
            <List>
              <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
                {items.map(({ id, text }) => (
                  <Draggable key={`draggable${id}`}>
                    <ListItem>
                      <TextField
                        label="Color"
                        variant="outlined"
                        defaultValue={text}
                        onChange={onChangeColorField}
                        id={`${id}`}
                        inputProps={{ maxLength: 7, pattern: "^#[a-fA-F0-9]{6}$" }}
                      />
                      <ListItemSecondaryAction>
                        <ListItemIcon className="drag-handle">
                          <DragHandleIcon />
                        </ListItemIcon>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Draggable>
                ))}
              </Container>
            </List>
          </AccordionDetails>
        </Accordion>
      </Card>

      <Box sx={{ m: 2 }}>
        <Button variant="contained" onClick={onClickButton}>虹色にする</Button>
        <CopyToClipBoard text={resultText}>
          <Button variant="contained" onClick={handleClick} sx={{ml: 2}}>結果をコピー</Button>
        </CopyToClipBoard>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            クリップボードにコピーしました
          </Alert>
        </Snackbar>
      </Box>

      <Card sx={{ m: 2 }}>
        <Box sx={{ padding: 2 }}>
          <TextField
            sx={{ width: 1 }}
            id="result-text"
            label="変換結果"
            multiline
            rows={4}
            value={resultText}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
      </Card>
    </div>
  );
}

export default App;
