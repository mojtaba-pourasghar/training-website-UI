import React from 'react';
import { Dialog } from 'primereact/dialog';

class Loading extends React.Component {
  render() {
    const { open } = this.props;

    return (
      <Dialog visible={open} style={{ width: '150px' }}  modal closable={false} >
        <div>Loading...</div>
      </Dialog>
    );
  }
}

export default Loading;