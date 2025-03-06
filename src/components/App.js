import { useState, useContext } from "react"
import FriendsData from "../data/friendsData.json"
import SocialMediaData from "../data/socialMediaData.json"
import { TranslationsContext } from "../contexts/TranslationsContext"

/**
 * @component App.
 * @returns {JSX.Element} - The App component.
 */
export default function App() {
  /**
   * Translations context.
   * @type {{object}}.
   */
  const { language, translations, changeLanguage } = useContext(TranslationsContext)

  /**
   * Texts translated.
   * @type {object}.
   */
  const texts = translations

  /**
   * List of friends.
   * @type {[object, function]}.
   */
  const [friends, setFriends] = useState(FriendsData.friends)

  /**
   * Check if show the add friend form.
   * @type {[boolean, function]}.
   */
  const [showAddFriend, setShowAddFriend] = useState(false)

  /**
   * Selected friend.
   * @type {[object, function]}.
   */
  const [selectedFriend, setSelectedFriend] = useState(friends[3])

  /**
   * Check if show the message.
   * @type {[boolean, function]}.
   */
  const [showMessage, setShowMessage] = useState(false)

  /**
   * Check if the split was successful.
   * @type {[boolean, function]}.
   */
  const [splitSuccess, setSplitSuccess] = useState(false)

  /**
   * Current page.
   * @type {[number, function]}.
   */
  const [currentPage, setCurrentPage] = useState(1)

  /**
   * Quantity of friends per page.
   * @type {[number, function]}.
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
    if (currentPage < Math.ceil(friends.length / friendsPerPage))
      setCurrentPage((prev) => prev + 1)
    else
      setCurrentPage(1)
  }

  /**
   * Handle go to the previous page.
   */
  function handlePreviousPage() {
    if (currentPage > 1)
      setCurrentPage((prev) => prev - 1)
    else
      setCurrentPage(Math.ceil(friends.length / friendsPerPage))
  }

  return (
    <div className="app">
      <LanguageFlag language={language} changeLanguage={changeLanguage} />
      <div className="core">
        <div className="sidebar">
          <FriendList texts={texts} friends={currentFriends} selectedFriend={selectedFriend} onSelection={handleSelection} />
          <div className="pagination">
            <Button onClick={handlePreviousPage}>
              {texts[8]}
            </Button>
            <span>
              {texts[9]} {currentPage} {texts[10]} {Math.ceil(friends.length / friendsPerPage)}
            </span>
            <Button onClick={handleNextPage}>
              {texts[11]}
            </Button>
          </div>
          {showAddFriend && <FormAddFriend texts={texts} onAddFriend={handleAddFriend} />}
          <Button onClick={handleShowAddFriend}>{showAddFriend ? texts[4] : texts[12]}</Button>
        </div>
        <div>
          {selectedFriend && <FormSplitBill texts={texts} selectedFriend={selectedFriend} onSplitBill={handleSplitBill} setShowMessage={setShowMessage} setSplitSuccess={setSplitSuccess} />}
          {showMessage && <Message texts={texts} setShowMessage={setShowMessage} splitSuccess={splitSuccess} />}
        </div>
      </div>
      <SocialMedia />
    </div>
  )
}

/**
 * @component LanguageFlag.
 * @param {string} language - The selected language.
 * @param {function} changeLanguage - Changes the language.
 * @returns {JSX.Element} - The Friend List component.
 */
function LanguageFlag({ language, changeLanguage }) {
  return (
    <div className="language-flag-container">
      <img className="language-flag" src={`flags/${language}.png`} alt={`Language Flag ${language}`} onClick={() => changeLanguage()} />
    </div>
  )
}

/**
 * @component FriendList.
 * @param {object} texts - The Translated Texts.
 * @param {object} friends - The friends list.
 * @param {object} selectedFriend - The selected friend.
 * @param {function} onSelection - Select a friend.
 * @returns {JSX.Element} - The Friend List component.
 */
function FriendList({ texts, friends, selectedFriend, onSelection }) {
  /**
   * List of the friends to show.
   * @type {object}.
   */
  const visibleFriends = friends.slice(0, 5)

  return (
    <ul>{visibleFriends.map(friend => <Friend texts={texts} key={friend.id} friend={friend} selectedFriend={selectedFriend} onSelection={onSelection} />)}</ul>
  )
}

/**
 * @component Friend.
 * @param {object} texts - The Translated Texts.
 * @param {object} friend - The friends.
 * @param {object} selectedFriend - The selected friend.
 * @param {function} onSelection - Select a friend.
 * @returns {JSX.Element} - The Friend component.
 */
function Friend({ texts, friend, selectedFriend, onSelection }) {
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
          {texts[0]} {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} {texts[1]} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && (
        <p>
          {texts[2]} {friend.name} {texts[3]}
        </p>
      )}
      <Button onClick={() => onSelection(friend)} selected={isSelected}>{isSelected ? texts[4] : texts[5]}</Button>
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
 * @param {object} texts - The Translated Texts.
 * @param {function} onAddFriend - Add a friend.
 * @returns {JSX.Element} - The Form Add Friend component.
 */
function FormAddFriend({ texts, onAddFriend }) {
  /**
   * The name of the new friend.
   * @type {[string, function]}.
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
      <InputText inputName="friend-name" value={name} setValue={setName}>👬{texts[6]}</InputText>
      <Button className={!name ? "disabled" : ""}>{texts[7]}</Button>
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
 * @param {object} texts - The Translated Texts.
 * @param {object} selectedFriend - The selected friend.
 * @param {function} onSplitBill - Split a bill.
 * @param {function} setShowMessage - Set if show the message.
 * @param {function} setSplitSuccess - Set if the split was successful.
 * @returns {JSX.Element} - The Form Split Bill component.
 */
function FormSplitBill({ texts, selectedFriend, onSplitBill, setShowMessage, setSplitSuccess }) {
  /**
   * The bill value.
   * @type {[number, function]}.
   */
  const [bill, setBill] = useState(0)

  /**
   * The value of the bill that corresponds to the user.
   * @type {[number, function]}.
   */
  const [paidByUser, setPaidByUser] = useState(0)

  /**
   * Who is paying the bill.
   * @type {[string, function]}.
   */
  const [whoIsPaying, setWhoIsPaying] = useState("user")

  /**
   * Check if the input bill is validated.
   * @type {[boolean, function]}.
   */
  const [inputBillValidated, setInputBillValidated] = useState(true)

  /**
   * The value of the bill that corresponds to the friend.
   * @type {[boolean, function]}.
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
      <h2>{texts[13]} {selectedFriend.name}</h2>
      <div>
        <label htmlFor="bill-value">💰 {texts[14]}</label>
      </div>
      <div className="form-split-bill-input-div">
        <input id="bill-value" name="bill-value" className="form-split-bill-input" type="number" value={bill} onChange={(e) => handleBill(Number(e.target.value))} maxLength={10} />
        <p className={`form-input-validation-message ${inputBillValidated ? "validated" : ""}`}>* {texts[15]} *</p>
      </div>
      <div>
        <label htmlFor="your-expense">🙍‍♂️ {texts[16]}</label>
      </div>
      <div className="form-split-bill-input-div">
        <input id="your-expense" name="your-expense" className="form-split-bill-input" type="number" value={paidByUser} onChange={(e) => setPaidByUser(Number(e.target.value) <= bill && Number(e.target.value) >= 0 ? Number(e.target.value) : paidByUser)} maxLength={10} />
      </div>
      <InputReadOnly inputName={"friend-expense"} paidByFriend={paidByFriend}>👬 {texts[17]}{selectedFriend.name}{texts[18]}</InputReadOnly>
      <InputSelect texts={texts} inputName={"person-paying"} selectedFriend={selectedFriend.name} whoIsPaying={whoIsPaying} setWhoIsPaying={setWhoIsPaying}>🤑 {texts[20]}</InputSelect>
      <Button>{texts[21]}</Button>
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
 * @param {object} texts - The Translated Texts.
 * @param {string} inputName - The name of the input.
 * @param {any} children - The children of the input.
 * @param {object} selectedFriend - The selected friend.
 * @param {string} whoIsPaying - The person who is paying the bill.
 * @param {function} setWhoIsPaying - Set the person who is paying the bill.
 * @returns {JSX.Element} - The Input Select component.
 */
function InputSelect({ texts, inputName, children, selectedFriend, whoIsPaying, setWhoIsPaying }) {
  return (
    <>
      <label htmlFor={inputName}>{children}</label>
      <select id={inputName} name={inputName} value={whoIsPaying} onChange={(e) => setWhoIsPaying((e.target.value))}>
        <option value="user">{texts[19]}</option>
        <option value="friend">{selectedFriend}</option>
      </select>
    </>
  )
}

/**
 * @component Message.
 * @param {object} texts - The Translated Texts.
 * @param {function} setShowMessage - Set if show the message.
 * @param {boolean} splitSuccess - Check if the split was successful.
 * @returns {JSX.Element} - The Message component.
 */
function Message({ texts, setShowMessage, splitSuccess }) {
  return (
    <div className="message-div">
      <div className="message-text">
        <p>{splitSuccess ? texts[22] : texts[23]}</p>
      </div>
      <div className="close-message-div">
        <button className="close-message-button" onClick={() => setShowMessage(false)}>{texts[24]}</button>
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