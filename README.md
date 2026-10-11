# When to Renew Your Identity Card?

A simple, interactive web tool that calculates when a Vietnamese Citizen Identity Card (CCCD/Căn cước) needs to be renewed based on the holder's birth date and the current legal regulations.

## 🚀 Live Demo

Check out the live demo: [https://www.sieu.io.vn/github/when-renew-identity-card](https://www.sieu.io.vn/github/when-renew-identity-card)

## ✨ Features

- **Birth Date Input** – Enter your date of birth using a date picker
- **Automatic Renewal Date Calculation** – Instantly calculates the exact dates when your identity card must be renewed
- **Based on Current Law** – Uses the renewal ages defined in Article 21 of the 2023 Identity Card Law (Luật Căn cước 2023): **14, 25, 40, and 60 years old**
- **2-Year Grace Period Handling** – Correctly applies the rule that cards issued, renewed, or reissued within 2 years before a renewal age remain valid until the next renewal age
- **Multiple Renewal Dates Displayed** – Shows all upcoming renewal milestones from today onward
- **Clean Interface** – Simple, user-friendly design with a clear layout
- **Responsive** – Works on desktop, tablet, and mobile devices

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)

## 📁 Project Structure

```
when-renew-identity-card/
├── index.html            # Main HTML file
├── style.css             # Stylesheet
├── script.js             # JavaScript calculation logic
└── README.md             # Project documentation
```

## 🔧 Installation & Usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/lemasieu/when-renew-identity-card.git
   ```
2. **Navigate to the project folder**   
   ```bash
   cd when-renew-identity-card
   ```
3. **Open the application**
   - Simply open `index.html` in your web browser
   - Or use a local development server (e.g., Live Server in VS Code)

## 📝 How It Works

1. **Enter your date of birth** – Use the date picker to select your birth date
2. **View the results** – The tool displays the exact dates when your identity card must be renewed, based on your age milestones
3. **Plan ahead** – Use the calculated dates to schedule your renewal appointment in advance

**Renewal Ages (according to current law):**

|Age | Action Required |
|---|---|
| 14 | First renewal |
| 25 | Mandatory renewal |
| 40 | Mandatory renewal |
| 60 | Mandatory renewal (card becomes valid for life after this) |

**2-Year Grace Period:**

If a card is issued, renewed, or reissued within **2 years before** a renewal age, it remains valid until the next renewal age. For example:
- A citizen who renews their card at age **38** (within 2 years before 40) will have a card valid until age **60**, skipping the age-40 renewa-.

**Important Notes:**

- "Reaching the age" means reaching the exact day, month, and year – not just the birth year.
- If a card is damaged, faded, or contains incorrect information, it must be renewed immediately, regardless of age.
- Failure to renew on time may result in an administrative fine of 300,000–500,000 VND.

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request or open an Issue.
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-source and available under the MIT License.

## ⚠️ Disclaimer

This tool is for **reference purposes only**. The calculated dates are based on the current legal regulations at the time of development. Always verify with your local police authority or the official VNeID application for the most up-to-date and accurate information regarding your specific case.

## 📚 References

- Article 21, Law on Identity Cards 2023 (Luật Căn cước 2023)
- Decree 144/2021/ND-CP on administrative penalties
