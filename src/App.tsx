import * as React from 'react';
import { useState } from "react";
import {
  Toolbar,
  AppBar,
  Button,
  IconButton,
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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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
  const [nextId, setNextId] = useState(items.length);
  const [isCheckedColor, setIsCheckedColor] = useState(false);
  const [preText, setPreText] = useState("");
  const [resultText, setResultText] = useState("");
  const [resultPreview, setResultPreview] = useState("");
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

  const onClickDeleteButton = (id: number) => {
    setItems(items.filter((value) => {
      return value.id !== id;
    }));
  }

  const onClickAddButton = () => {
    setItems([...items, {id: nextId, text: "#000000"}]);
    setNextId(nextId + 1);
  }

  const onClickButton = () => {
    const skipChar = [" ", "???", "\r", "\n", "\r\n"];
    const nlChar = ["\r", "\n", "\r\n"];
    var result = "";
    var preview = "";
    var color = isCheckedColor ? items.map((value) => value.text) : defaultColors;

    preText.split('').forEach((char, index) => {
      if (skipChar.includes(char)) {
        result += char;
        preview += nlChar.includes(char) ? "<br>" : char;
      } else {
        result += `[color=${color[index % color.length]}]${char}[/color]`;
        preview += `<span style="color:${color[index % color.length]}">${char}</span>`;
      }
    });
    
    setResultText(result);
    setResultPreview(preview);
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
            ??????????????????????????????????????????????????????
          </Typography>
        </Toolbar>
      </AppBar>

      <Card sx={{ m: 2 }}>
        <Box sx={{ padding: 2 }}>
          <TextField
            sx={{ width: 1 }}
            id="pre-text"
            label="????????????????????????"
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
            <Typography>??????????????????</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked={false} onChange={onChangeColorBox}/>} label="??????????????????????????????" />
            </FormGroup>
          </AccordionDetails>
          <Box sx={{display: isCheckedColor ? '' : 'none'}}>
            <AccordionDetails>
              <List>
                <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
                  {items.map((value) => (
                    <Draggable key={value.id}>
                      <ListItem>
                        <ListItemIcon className="drag-handle">
                          <DragHandleIcon />
                        </ListItemIcon>
                        <TextField
                          label={`Color`}
                          variant="outlined"
                          defaultValue={value.text}
                          onChange={onChangeColorField}
                          id={`${value.id}`}
                          inputProps={{ maxLength: 7, pattern: "^#[a-fA-F0-9]{6}$" }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => onClickDeleteButton(value.id)}>
                            <DeleteForeverIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Draggable>
                  ))}
                </Container>
              </List>
            </AccordionDetails>
            <IconButton onClick={onClickAddButton} sx={{ml: 3, mb: 4}}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>
        </Accordion>
      </Card>

      <Box sx={{ m: 2 }}>
        <Button variant="contained" onClick={onClickButton}>???????????????</Button>
        <CopyToClipBoard text={resultText}>
          <Button variant="contained" onClick={handleClick} sx={{ml: 2}}>??????????????????</Button>
        </CopyToClipBoard>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            ?????????????????????????????????????????????
          </Alert>
        </Snackbar>
      </Box>

      <Card sx={{ m: 2 }}>
        <Box sx={{ padding: 2 }}>
          <TextField
            sx={{ width: 1 }}
            id="result-text"
            label="????????????"
            multiline
            rows={4}
            value={resultText}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
        <Box sx={{ padding: 2 }}>
          <Typography variant="caption">
            ???????????????
          </Typography>
          <Typography>
            <span dangerouslySetInnerHTML={{__html: resultPreview}}></span>
          </Typography>
        </Box>
      </Card>
    </div>
  );
}

export default App;
