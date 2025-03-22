import React from "react";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {useNavigate} from "react-router-dom";
function ConfirmEmail() {
    const [openModal, setOpenModal] = useState(true);
    const navigate = useNavigate();
    return (
        <>
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                          You need to confirm your email address.
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => window.open("https://gmail.com", "_blank")}>
                                {"Go to email"}
                            </Button>
                            <Button color="gray" onClick={()=>navigate("/login")}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ConfirmEmail;