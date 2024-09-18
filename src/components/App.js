import { useState } from "react";
import FriendsData from "../data/friendsData.json";

export default function App() {
  const [friends, setFriends] = useState(FriendsData.friends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(friends[0]);
  const [showMessage, setShowMessage] = useState(false);
  const [splitSuccess, setSplitSuccess] = useState(false);

  function handleShowAddFriend() {
    setShowAddFriend((showAddFriend) => !showAddFriend);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => cur?.id === friend.id ? null : friend)
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) => friends.map((friend) => friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend));
    setSelectedFriend(null);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendList friends={friends} selectedFriend={selectedFriend} onSelection={handleSelection} />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>{showAddFriend ? "Close" : "Add friend"}</Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill} setShowMessage={setShowMessage} setSplitSuccess={setSplitSuccess} />}
      {showMessage && <Message setShowMessage={setShowMessage} splitSuccess={splitSuccess} />}
    </div>
  )
}

function FriendList({ friends, selectedFriend, onSelection }) {
  return (
    <ul>{friends.map(friend => <Friend key={friend.id} friend={friend} selectedFriend={selectedFriend} onSelection={onSelection} />)}</ul >
  )
}

function Friend({ friend, selectedFriend, onSelection }) {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && (
        <p>
          You and {friend.name} are even
        </p>
      )}
      <Button onClick={() => onSelection(friend)} selected={isSelected}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  )
}

function Button({ children, onClick, selected }) {
  return (
    <button className={`button ${selected ? "button-selected" : ""}`} onClick={onClick} > {children}</button >
  )
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name) return;

    const id = crypto.randomUUID();
    const newFriendName = name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    const newFriend = {
      id,
      name: newFriendName,
      image: `https://i.pravatar.cc/48?${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <InputText value={name} setValue={setName}>👬Friend Name</InputText>
      <Button>Add</Button>
    </form >
  )
}

function InputText({ children, value, setValue }) {
  return (
    <>
      <label>{children}</label>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} maxLength={10} />
    </>
  )
}

function FormSplitBill({ selectedFriend, onSplitBill, setShowMessage, setSplitSuccess }) {
  const [bill, setBill] = useState(0);
  const [paidByUser, setPaidByUser] = useState(0);
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const [inputBillValidated, setInputBillValidated] = useState(true);
  const paidByFriend = bill ? bill - paidByUser : "";

  function handleBill(billValue) {
    if (billValue > 0) {
      setBill(billValue)
      if (billValue < paidByUser)
        setPaidByUser(billValue)
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (bill === 0) {
      setInputBillValidated(false);
      return;
    };

    if ((bill === paidByUser && whoIsPaying === "user") || (bill === paidByFriend && whoIsPaying === "friend")) {
      // let title = "Splitting this bill won't affect your current balance with " + selectedFriend.name;
      // TODO: Add Notification this bill won't affect your current balance
    } else {
      onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
      // TODO: Add Notification bill split successfully
    }
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <div>
        <label>💰 Bill value</label>
      </div>
      <div className="form-split-bill-input-div">
        <input className="form-split-bill-input" type="number" value={bill} onChange={(e) => handleBill(Number(e.target.value))} maxLength={10} />
        <p className={`form-input-validation-message ${inputBillValidated ? "validated" : ""}`}>* Must be above 0 *</p>
      </div>
      <div>
        <label>🙍‍♂️ Your expense</label>
      </div>
      <div className="form-split-bill-input-div">
        <input className="form-split-bill-input" type="number" value={paidByUser} onChange={(e) => setPaidByUser(Number(e.target.value) <= bill && Number(e.target.value) >= 0 ? Number(e.target.value) : paidByUser)} maxLength={10} />
      </div>
      <InputReadOnly paidByFriend={paidByFriend}>👬 {selectedFriend.name}'s expense</InputReadOnly>
      <InputSelect selectedFriend={selectedFriend.name} whoIsPaying={whoIsPaying} setWhoIsPaying={setWhoIsPaying}>🤑 Who is paying the bill</InputSelect>
      <Button>Split bill</Button>
    </form >
  )
}

function InputReadOnly({ children, paidByFriend }) {
  return (
    <>
      <label>{children}</label>
      <div className="form-split-bill-input-div">
        <input className="form-split-bill-input" type="number" value={paidByFriend} disabled />
      </div>
    </>
  )
}

function InputSelect({ children, selectedFriend, whoIsPaying, setWhoIsPaying }) {
  return (
    <>
      <label>{children}</label>
      <select value={whoIsPaying} onChange={(e) => setWhoIsPaying((e.target.value))}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend}</option>
      </select>
    </>
  )
}

function Message({ setShowMessage, splitSuccess }) {
  return (
    <div className="message-div">
      <div className="message-text">
        <p>{splitSuccess ? "Bill split succesfully!!" : "Splitting this bill won't affect your current balance."}</p>
      </div>
      <div className="close-message-div">
        <button className="close-message-button" onClick={() => setShowMessage(false)}>ACCEPT</button>
      </div>
    </div>
  )
}