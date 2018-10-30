import * as React from 'react';
import { connect } from 'react-redux';
import { Button, TextField, DialogContainer } from 'react-md';
import TripEntity from 'entities/Trip/action';
import _ from 'lodash';

class NoteView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            note: _.get(props.trip, 'note'),
        };
        this.saveNote = this.saveNote.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    saveNote() {
        const { note } = this.state,
            { id } = this.props.trip;
        this.props.saveNote(
            {
                id,
                note,
            },
            this.props.closeWindow,
        );
    }
    handleChange(note) {
        this.setState({ note });
    }
    render() {
        const { saveNote, handleChange } = this,
            { note } = this.state,
            { closeWindow } = this.props;
        return (
            <DialogContainer
                id="idTripNoteWindow"
                visible
                aria-labelledby="view detail"
                focusOnMount={false}
                modal
            >
                <header className="modal-header">
                    <h2 className="montserrat-bold">Notes</h2>
                    <Button icon primary onClick={closeWindow}>
                        close
                    </Button>
                </header>

                <TextField
                    id="idNoteWindow"
                    placeholder=""
                    value={note}
                    rows={7}
                    maxRows={7}
                    className="md-cell md-cell--bottom"
                    onChange={handleChange}
                />
                <Button
                    id="idNoteWindowButton"
                    primary
                    raised
                    onClick={saveNote}
                >
                    Save
                </Button>
            </DialogContainer>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveNote: (params, closeWindow) => {
            dispatch(TripEntity.ui.update(params));
            TripEntity.after.update = () => {
                closeWindow();
            };
        },
    };
};

export default connect(null, mapDispatchToProps)(NoteView);
