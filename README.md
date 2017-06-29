# About #
This is a Node application that scrapes the Fulton County Tax Office's property records for some of the parcel IDs listed in the file `Harbour_addresses_v8.csv`. As a lot of the properties are outside of Fulton County, `extract-from-csv.js` is a script that pulls the Atlanta addresses from `Harbour_addresses_v8`. Some manual cleaning was done to correct multiple incomplete parcel IDs and one duplicate; the cleaned file is called `Harbour_ATL_addresses-CLEAN.csv`.  
## Technologies Used ##
Cheerio is used to extract HTML elements and fast-csv is used to read and write csv files. This uses ES6 syntax extensively.

# Getting Started #
`git clone https://github.com/chrisdobbins/housing-justice.git`
`npm install`

# Background #

The Atlanta Legal Aid Society provides free civil legal services to low-income people to improve their “social, political, and economic conditions.” Since their founding in 1924, they have won many landmark cases and coined the term “predatory lending.”  Atlanta Legal Aid is currently involved in a housing justice lawsuit against Harbour Portfolio Advisors, a company that profits from selling homes through “contract-for-deed” agreements. These land contract arrangements are frequently marketed as an alternative way for low-income people to buy homes if they may not qualify for a traditional mortgage. They typically involve a down payment, high interest rate, and sale price well above the actual assessed value of the home. Prospective buyers pay a monthly rate, as with a typical mortgage, and often have to take on high home-repair costs and property taxes; however, they do not receive the legal title to the home until the full purchase price has been paid. If they default on a single payment, buyers forfeit their right to the property, with no equity. In many cases, prospective buyers of these homes are not aware of the terms under which they enter into such contracts, and Harbour has come under scrutiny in many locations for discriminatory lending practices.
