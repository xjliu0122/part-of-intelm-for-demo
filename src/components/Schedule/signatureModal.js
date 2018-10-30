import * as React from 'react';
import { connect } from 'react-redux';
import { Button, DialogContainer, Media } from 'react-md';
import TripEntity from 'entities/Trip/action';
import _ from 'lodash';
import axios from 'axios';
import './signatureModal.scss';

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || 'application/pdf';
    sliceSize = sliceSize || 512;

    //const byteCharacters = atob(b64Data);
    const byteCharacters = b64Data;
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
class SignatureModalView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.previewImage = this.previewImage.bind(this);
        this.openOriginalDoc = this.openOriginalDoc.bind(this);
    }
    componentWillMount = () => {
        this.props.fetchSignature({ id: this.props.id });
    };
    previewImage() {
        const data = _.get(this.props, 'signature.data');
        const image = new Image();
        image.src = data;
        const w = window.open('');
        w.document.write(image.outerHTML);
    }
    openOriginalDoc() {
        const link = _.get(this.props, 'link');
        //const pdfWindow = 
        window.open(`http://docs.google.com/gview?url=${link}`);
        //pdfWindow.document.write(`<iframe src="http://docs.google.com/gview?url=${link}&embedded=true" style="width:100%; height:100%;" frameborder="0"></iframe>`);
    }
    render() {
        const { signature, closeWindow, link } = this.props;
        const { previewImage, openOriginalDoc } = this;
        return (
            <DialogContainer
                id="idSignatureWindow"
                visible
                aria-labelledby="view detail"
                focusOnMount={false}
                modal
            >
                <header className="modal-header">
                    <h2 className="montserrat-bold">
                        {signature.type === 'sig' ? 'Signature' : 'POD'}
                    </h2>
                    <Button icon primary onClick={closeWindow}>
                        close
                    </Button>
                </header>
                <iv className="row signed-by">
                    <div className="col-2">
                        <h4>By: </h4>
                    </div>
                    <div className="col-8">
                        <h4>{signature.signedBy}</h4>
                    </div>
                </iv>
                <div className="sig-pod-container">
                    <img
                        className={
                            signature.type === 'sig'
                                ? 'signature-pad'
                                : 'signature-pic'
                        }
                        src={signature.data}
                        alt={signature.signedBy}
                    />

                    <div>
                        <br />
                        {signature.type !== 'sig' && (
                            <Button
                                className="preview-button"
                                raised
                                primary
                                onClick={previewImage}
                            >
                                View Larger
                            </Button>
                        )}
                        {link && (
                            <Button
                                className="open-doc-button"
                                raised
                                primary
                                onClick={openOriginalDoc}
                            >
                                Open Document
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContainer>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchSignature: params => {
            dispatch(TripEntity.ui.getSignatureOrPOD(params));
        },
    };
};
const mapStateToProps = (state, ownProps) => {
    return {
        signature: state.tripReducer.signature,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(SignatureModalView);
