import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import { Card, CardTitle, CardActions, Button, TextField } from 'react-md';
import './styles.scss';

class AmountEditor extends Component {
    constructor(props) {
        super(props);
        //openSetting
        this.state = {
            openDialog: false,
            amount: null,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.setOpenEditDialog = this.setOpenEditDialog.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
    }

    setOpenEditDialog(openDialog) {
        this.setState({
            openDialog,
        });
    }
    handleAmountChange(amount) {
        this.setState({
            amount,
        });
    }
    handleSubmit() {
        this.props.onSubmit && this.props.onSubmit(this.state.amount);
        this.setOpenEditDialog(false);
    }
    render() {
        const { handleSubmit, setOpenEditDialog, handleAmountChange } = this,
            { openDialog, amount } = this.state;
        return (
            <div className="amount-editor-button-container">
                <div className="action-buttons">
                    <IconButton title="Enter Amount">
                        <AttachMoneyIcon
                            onClick={() => setOpenEditDialog(true)}
                        />
                    </IconButton>
                </div>
                {openDialog && (
                    <Card className="edit-dialog">
                        <TextField
                            value={amount}
                            type="number"
                            label="Amount"
                            onChange={value => {
                                handleAmountChange(value);
                            }}
                        />
                        <div className="btn-actions">
                            <Button
                                primary
                                flat
                                onClick={() => handleSubmit(amount)}
                                iconBefore
                                iconChildren="done"
                            >
                                OK
                            </Button>
                            <Button
                                secondary
                                flat
                                onClick={() => setOpenEditDialog(false)}
                                iconBefore
                                iconChildren="close"
                            >
                                Cancel
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        );
    }
}

export default AmountEditor;
