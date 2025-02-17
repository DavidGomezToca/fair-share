import { useState } from "react"
import FriendsData from "../data/friendsData.json"
import SocialMediaData from "../data/socialMediaData.json"

/**
 * @component App.
 * @returns {JSX.Element} - The App component.
 */
export default function App() {
  /**
   * List of friends.
   * @type {object, function}.
   */
  const [friends, setFriends] = useState(FriendsData.friends)

  /**
   * Check if show the add friend form.
   * @type {boolean, function}.
   */
  const [showAddFriend, setShowAddFriend] = useState(false)

  /**
   * Selected friend.
   * @type {object, function}.
   */
  const [selectedFriend, setSelectedFriend] = useState(friends[3])

  /**
   * Check if show the message.
   * @type {boolean, function}.
   */
  const [showMessage, setShowMessage] = useState(false)

  /**
   * Check if the split was successful.
   * @type {boolean, function}.
   */
  const [splitSuccess, setSplitSuccess] = useState(false)

  /**
   * Current page.
   * @type {number, function}.
   */
  const [currentPage, setCurrentPage] = useState(1)

  /**
   * Quantity of friends per page.
   * @type {number, function}.
   */
  const friendsPerPage = 5

  /**
   * Handle show add friend form.
   */
  function handleShowAddFriend() {
    setShowAddFriend((showAddFriend) => !showAddFriend)
  }

  /**
   * Add a friend to the list.
   * @param {object} friend - The friend to add.
   */
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend])
    setShowAddFriend(false)
  }

  /**
   * Handle select a friend.
   * @param {object} friend - The friend to select.
   */
  function handleSelection(friend) {
    setSelectedFriend((cur) => cur?.id === friend.id ? null : friend)
    setShowAddFriend(false)
  }

  /**
   * Take the value for update the balance with the selected friend.
   * @param {number} value - The value to update the balance with.
   */
  function handleSplitBill(value) {
    setFriends((friends) => friends.map((friend) => friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend))
    setSelectedFriend(null)
  }

  /**
   * Index of the last friend.
   * @type {number}.
  */
  const indexOfLastFriend = currentPage * friendsPerPage

  /**
   * Index of the first friend.
   * @type {number}.
  */
  const indexOfFirstFriend = indexOfLastFriend - friendsPerPage

  /**
   * List of friends for the current page.
   * @type {object}.
  */
  const currentFriends = friends.slice(indexOfFirstFriend, indexOfLastFriend)

  /**
   * Handle go to the next page.
   */
  function handleNextPage() {
    if (currentPage < Math.ceil(friends.length / friendsPerPage)) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  /**
   * Handle go to the previous page.
   */
  function handlePreviousPage() {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={currentFriends} selectedFriend={selectedFriend} onSelection={handleSelection} />
        <div className="pagination">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {Math.ceil(friends.length / friendsPerPage)}
          </span>
          <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(friends.length / friendsPerPage)}>
            Next
          </Button>
        </div>
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>{showAddFriend ? "Close" : "Add friend"}</Button>
      </div>
      <div>
        {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill} setShowMessage={setShowMessage} setSplitSuccess={setSplitSuccess} />}
        {showMessage && <Message setShowMessage={setShowMessage} splitSuccess={splitSuccess} />}
        <SocialMedia />
      </div>
    </div>
  )
}

/**
 * @component FriendList.
 * @param {object} friends - The friends list.
 * @param {object} selectedFriend - The selected friend.
 * @param {function} onSelection - Select a friend.
 * @returns {JSX.Element} - The Friend List component.
 */
function FriendList({ friends, selectedFriend, onSelection }) {
  /**
   * List of the friends to show.
   * @type {object}.
   */
  const visibleFriends = friends.slice(0, 5)

  return (
    <ul>{visibleFriends.map(friend => <Friend key={friend.id} friend={friend} selectedFriend={selectedFriend} onSelection={onSelection} />)}</ul>
  )
}

/**
 * @component Friend.
 * @param {object} friend - The friends.
 * @param {object} selectedFriend - The selected friend.
 * @param {function} onSelection - Select a friend.
 * @returns {JSX.Element} - The Friend component.
 */
function Friend({ friend, selectedFriend, onSelection }) {
  /**
   * Check if the friend is selected.
   * @type {boolean}.
   */
  const isSelected = friend.id === selectedFriend?.id

  return (
    <li className={`friend ${isSelected ? "friend-selected" : ""}`}>
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

/**
 * @component Button.
 * @param {any} children - The children of the button.
 * @param {function} onClick - The function to execute when the button is clicked.
 * @param {boolean} selected - Check if the button is selected.
 * @param {string} className - Default = "" - Aditional Class Name if necesary.
 * @returns {JSX.Element} - The Friend component.
 */
function Button({ children, onClick, selected, className = "" }) {
  return (
    <button className={`button ${selected ? "button-selected" : ""} ${className}`} onClick={onClick}> {children}</button>
  )
}

/**
 * @component FormAddFriend.
 * @param {function} onAddFriend - Add a friend.
 * @returns {JSX.Element} - The Form Add Friend component.
 */
function FormAddFriend({ onAddFriend }) {
  /**
   * The name of the new friend.
   * @type {string, function}.
   */
  const [name, setName] = useState("")

  /**
   * Proces the submit.
   * @param {React.FormEvent} e - The form submission event.
   */
  function handleSubmit(e) {
    e.preventDefault()

    // If the name is empty, return.
    if (!name) return

    // Generate a new friend.
    const id = crypto.randomUUID()
    const newFriendName = name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase()
    const newFriend = {
      id,
      name: newFriendName,
      image: `https://i.pravatar.cc/48?${id}`,
      balance: 0,
    }

    // Add the new friend.
    onAddFriend(newFriend)
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <InputText inputName="friend-name" value={name} setValue={setName}>👬Friend Name</InputText>
      <Button className={!name ? "disabled" : ""}>Add</Button>
    </form>
  )
}

/**
 * @component InputText.
 * @param {string} inputName - The name of the input.
 * @param {any} children - The children of the input.
 * @param {string} value - The value of the input.
 * @param {function} setValue - The function to set the value of the input.
 * @returns {JSX.Element} - The Input Text component.
 */
function InputText({ inputName, children, value, setValue }) {
  return (
    <>
      <label htmlFor={inputName}>{children}</label>
      <input id={inputName} name={inputName} type="text" value={value} onChange={(e) => setValue(e.target.value)} maxLength={10} />
    </>
  )
}

/**
 * @component FormSplitBill.
 * @param {object} selectedFriend - The selected friend.
 * @param {function} onSplitBill - Split a bill.
 * @param {function} setShowMessage - Set if show the message.
 * @param {function} setSplitSuccess - Set if the split was successful.
 * @returns {JSX.Element} - The Form Split Bill component.
 */
function FormSplitBill({ selectedFriend, onSplitBill, setShowMessage, setSplitSuccess }) {
  /**
   * The bill value.
   * @type {number, function}.
   */
  const [bill, setBill] = useState(0)

  /**
   * The value of the bill that corresponds to the user.
   * @type {number, function}.
   */
  const [paidByUser, setPaidByUser] = useState(0)

  /**
   * Who is paying the bill.
   * @type {string, function}.
   */
  const [whoIsPaying, setWhoIsPaying] = useState("user")

  /**
   * Check if the input bill is validated.
   * @type {boolean, function}.
   */
  const [inputBillValidated, setInputBillValidated] = useState(true)

  /**
   * The value of the bill that corresponds to the friend.
   * @type {boolean, function}.
   */
  const paidByFriend = bill ? bill - paidByUser : 0

  /**
   * Set the bill value.
   * @param {number} billValue - The target value of the bill.
   */
  function handleBill(billValue) {
    if (billValue > 0) {
      setBill(billValue)
      // If the bill value is less than the value paid by the user, set the value paid by the user to the bill value.
      if (billValue < paidByUser)
        setPaidByUser(billValue)
    }
  }

  /**
   * Proces the submit.
   * @param {React.FormEvent} e - The form submission event.
   */
  function handleSubmit(e) {
    e.preventDefault()

    // If the bill is 0, return.
    if (bill === 0) {
      setInputBillValidated(false)
      return
    }

    // If split the bill won't affect the balance, return.
    if ((bill === paidByUser && whoIsPaying === "user") || (bill === paidByFriend && whoIsPaying === "friend"))
      setSplitSuccess(false)
    // Else split the bill.
    else {
      onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser)
      setSplitSuccess(true)
    }
    // Show the message.
    setShowMessage(true)
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <div>
        <label htmlFor="bill-value">💰 Bill value</label>
      </div>
      <div className="form-split-bill-input-div">
        <input id="bill-value" name="bill-value" className="form-split-bill-input" type="number" value={bill} onChange={(e) => handleBill(Number(e.target.value))} maxLength={10} />
        <p className={`form-input-validation-message ${inputBillValidated ? "validated" : ""}`}>* Must be above 0 *</p>
      </div>
      <div>
        <label htmlFor="your-expense">🙍‍♂️ Your expense</label>
      </div>
      <div className="form-split-bill-input-div">
        <input id="your-expense" name="your-expense" className="form-split-bill-input" type="number" value={paidByUser} onChange={(e) => setPaidByUser(Number(e.target.value) <= bill && Number(e.target.value) >= 0 ? Number(e.target.value) : paidByUser)} maxLength={10} />
      </div>
      <InputReadOnly inputName={"friend-expense"} paidByFriend={paidByFriend}>👬 {selectedFriend.name}'s expense</InputReadOnly>
      <InputSelect inputName={"person-paying"} selectedFriend={selectedFriend.name} whoIsPaying={whoIsPaying} setWhoIsPaying={setWhoIsPaying}>🤑 Who is paying the bill</InputSelect>
      <Button>Split bill</Button>
    </form>
  )
}

/**
 * @component InputReadOnly.
 * @param {string} inputName - The name of the input.
 * @param {any} children - The children of the input.
 * @param {number} paidByFriend - The value of the bill that corresponds to the friend.
 * @returns {JSX.Element} - The Input Read Only component.
 */
function InputReadOnly({ inputName, children, paidByFriend }) {
  return (
    <>
      <label htmlFor={inputName}>{children}</label>
      <div className="form-split-bill-input-div">
        <input id={inputName} name={inputName} className="form-split-bill-input" type="number" value={paidByFriend} disabled />
      </div>
    </>
  )
}

/**
 * @component InputSelect.
 * @param {string} inputName - The name of the input.
 * @param {any} children - The children of the input.
 * @param {object} selectedFriend - The selected friend.
 * @param {string} whoIsPaying - The person who is paying the bill.
 * @param {function} setWhoIsPaying - Set the person who is paying the bill.
 * @returns {JSX.Element} - The Input Select component.
 */
function InputSelect({ inputName, children, selectedFriend, whoIsPaying, setWhoIsPaying }) {
  return (
    <>
      <label htmlFor={inputName}>{children}</label>
      <select id={inputName} name={inputName} value={whoIsPaying} onChange={(e) => setWhoIsPaying((e.target.value))}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend}</option>
      </select>
    </>
  )
}

/**
 * @component Message.
 * @param {function} setShowMessage - Set if show the message.
 * @param {boolean} splitSuccess - Check if the split was successful.
 * @returns {JSX.Element} - The Message component.
 */
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

/**
 * @component SocialMedia.
 * @returns {JSX.Element} - The Social Media component.
 */
function SocialMedia() {
  /**
   * Social Medias List.
   * @type {object}.
   */
  const socialMedias = SocialMediaData.socialMedias

  return (
    <div className="social-media">
      {socialMedias.map((socialMedia) => (
        <SocialMediaIcon key={`social-media-${socialMedia.name}`} url={socialMedia.url} icon={socialMedia.icon} />
      ))}
    </div>
  )

  /**
   * @component Social Media Icon.
   * @param {string} url - The URL of the social media.
   * @param {string} icon - The icon of the social media.
   * @returns {JSX.Element} - The Social Media Icon component.
   */
  function SocialMediaIcon({ url, icon }) {
    return (
      <a className="icon" href={url} target="_blank" rel="noreferrer">
        <i className={icon} />
      </a>
    )
  }
}