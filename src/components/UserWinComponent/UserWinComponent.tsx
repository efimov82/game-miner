import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function UserWinComponent() {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Congratulations!!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>You're win!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Play again
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
