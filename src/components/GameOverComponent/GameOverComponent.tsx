import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function GameOverComponent() {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Game over</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sorry, you're lose!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Open all mines
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Play again
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
