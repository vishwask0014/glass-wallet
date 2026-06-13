import Modal from "@/app/Components/common/Modal";

type transactionType = {
  userId: string;
  type: string;
  amount: number;
  category: string;
  createAt: string;
  note?: string;
  merchant: string;
};

interface EditTransactionModalProps {
  onClose: () => void;
  transaction: transactionType;
}

export default function EditTransactionModal({
  onClose,
  transaction,
}: EditTransactionModalProps) {
  console.log(transaction, ">>>>transaction");

  const editTransaction = transaction?.filter(
    (item: string) => item?.transcationID === "123",
  );

  console.log(editTransaction, ">>>>editTransaction");

  return (
    <>
      <Modal title="edit Transaction" onClose={onClose}>
        asdasdasd
      </Modal>
    </>
  );
}
