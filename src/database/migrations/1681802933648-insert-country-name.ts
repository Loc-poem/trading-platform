import { MigrationInterface, QueryRunner } from "typeorm";

export class insertCountryName1681802933648 implements MigrationInterface {
    name = 'insertCountryName1681802933648'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Afghanistan' WHERE name = 'Afghan'`  )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Albania' WHERE name = 'Albanian'`  )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Algeria' WHERE name = 'Algerian'`  )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'United States of America' WHERE name = 'American'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Andorra' WHERE name = 'Andorran'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Angola' WHERE name = 'Angolan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Anguilla' WHERE name = 'Anguillan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Argentina' WHERE name = 'Argentine'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Armenia' WHERE name = 'Armenian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Australia' WHERE name = 'Australian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Austria' WHERE name = 'Austrian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Azerbaijan' WHERE name = 'Azerbaijani'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Bahamas' WHERE name = 'Bahamian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Bahrain' WHERE name = 'Bahraini'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Bangladesh' WHERE name = 'Bangladeshi'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Barbados' WHERE name = 'Barbadian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Belarus' WHERE name = 'Belarusian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Belgium' WHERE name = 'Belgian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Belize' WHERE name = 'Belizean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Benin' WHERE name = 'Beninese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Bermuda' WHERE name = 'Bermudian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Bhutan' WHERE name = 'Bhutanese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Bolivia' WHERE name = 'Bolivian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Botswana' WHERE name = 'Botswanan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Brazil' WHERE name = 'Brazilian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'United Kingdom' WHERE name = 'British'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'British Virgin Islands' WHERE name = 'British Virgin Islander'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Brunei' WHERE name = 'Bruneian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Bulgaria' WHERE name = 'Bulgarian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Burkina Faso' WHERE name = 'Burkinabé'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Myanmar' WHERE name = 'Burmese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Cambodia' WHERE name = 'Cambodian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Cameroon' WHERE name = 'Cameroonian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Canada' WHERE name = 'Canadian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Cape Verde' WHERE name = 'Cape Verdean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Cayman Islands' WHERE name = 'Cayman Islander'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Central African Republic' WHERE name = 'Central African'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Chad' WHERE name = 'Chadian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Chile' WHERE name = 'Chilean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'China' WHERE name = 'Chinese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Antigua and Barbuda' WHERE name = 'Citizen of Antigua and Barbuda'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Bosnia and Herzegovina' WHERE name = 'Citizen of Bosnia and Herzegovina'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Guinea-Bissau' WHERE name = 'Citizen of Guinea-Bissau'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Kiribati' WHERE name = 'Citizen of Kiribati'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Seychelles' WHERE name = 'Citizen of Seychelles'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Vanuatu' WHERE name = 'Citizen of Vanuatu'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Colombia' WHERE name = 'Colombian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Comoros' WHERE name = 'Comoran'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Congo (Congo-Brazzaville)' WHERE name = 'Congolese (Congo)'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Democratic Republic of the Congo' WHERE name = 'Congolese (DRC)'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Cook Islands' WHERE name = 'Cook Islander'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Costa Rica' WHERE name = 'Costa Rican'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Croatia' WHERE name = 'Croatian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Cyprus' WHERE name = 'Cypriot'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Czechia (Czech Republic)' WHERE name = 'Czech'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Danish' WHERE name = 'Danish'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Djibouti' WHERE name = 'Djiboutian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Dominican Republic' WHERE name = 'Dominican'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Netherlands' WHERE name = 'Dutch'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'East Timor' WHERE name = 'East Timorese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Ecuador' WHERE name = 'Ecuadorean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Egypt' WHERE name = 'Egyptian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Equatorial Guinea' WHERE name = 'Equatorial Guinean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Eritrea' WHERE name = 'Eritrean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Estonia' WHERE name = 'Estonian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Ethiopia' WHERE name = 'Ethiopian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Falkland Islands' WHERE name = 'Falkland Island'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Faroe Islands' WHERE name = 'Faroese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Fiji' WHERE name = 'Fijian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Philippines' WHERE name = 'Filipino'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Finland' WHERE name = 'Finnish'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'France' WHERE name = 'French'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Gabon' WHERE name = 'Gabonese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Gambia' WHERE name = 'Gambian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Georgia' WHERE name = 'Georgian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Germany' WHERE name = 'German'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Ghana' WHERE name = 'Ghanaian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Gibraltar' WHERE name = 'Gibraltarian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Greece' WHERE name = 'Greek'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Greenland' WHERE name = 'Greenlandic'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Grenada' WHERE name = 'Grenadian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Guam' WHERE name = 'Guamanian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Guatemala' WHERE name = 'Guatemalan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Guinea' WHERE name = 'Guinean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Guyana' WHERE name = 'Guyanese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Haiti' WHERE name = 'Haitian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Honduras' WHERE name = 'Honduran'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Hong Kong' WHERE name = 'Hong Konger'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Hungary' WHERE name = 'Hungarian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Iceland' WHERE name = 'Icelandic'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'India' WHERE name = 'Indian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Indonesia' WHERE name = 'Indonesian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Ireland' WHERE name = 'Irish'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Israel' WHERE name = 'Israeli'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Italy' WHERE name = 'Italian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Côte d Ivoire' WHERE name = 'Ivorian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Jamaica' WHERE name = 'Jamaican'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Japan' WHERE name = 'Japanese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Jordan' WHERE name = 'Jordanian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Kazakhstan' WHERE name = 'Kazakh'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Kenya' WHERE name = 'Kenyan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Saint Kitts and Nevis' WHERE name = 'Kittitian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Kuwait' WHERE name = 'Kuwaiti'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Kyrgyzstan' WHERE name = 'Kyrgyz'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Laos' WHERE name = 'Lao'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Latvia' WHERE name = 'Latvian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Liberia' WHERE name = 'Liberian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Liechtenstein' WHERE name = 'Liechtenstein citizen'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Lithuania' WHERE name = 'Lithuanian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Luxembourg' WHERE name = 'Luxembourger'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Macau' WHERE name = 'Macanese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'North Macedonia' WHERE name = 'Macedonian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Madagascar' WHERE name = 'Malagasy'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Malawi' WHERE name = 'Malawian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Malaysia' WHERE name = 'Malaysian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Maldives' WHERE name = 'Maldivian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Mali' WHERE name = 'Malian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Malta' WHERE name = 'Maltese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Marshall Islands' WHERE name = 'Marshallese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Martinique' WHERE name = 'Martiniquais'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Mauritania' WHERE name = 'Mauritanian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Mauritius' WHERE name = 'Mauritian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Mexico' WHERE name = 'Mexican'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Micronesia' WHERE name = 'Micronesian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Moldova' WHERE name = 'Moldovan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Monaco' WHERE name = 'Monegasque'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Mongolia' WHERE name = 'Mongolian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Montenegro' WHERE name = 'Montenegrin'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Montserrat' WHERE name = 'Montserratian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Morocco' WHERE name = 'Moroccan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Mozambique' WHERE name = 'Mozambican'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Namibia' WHERE name = 'Namibian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Nauru' WHERE name = 'Nauruan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Nepal' WHERE name = 'Nepalese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'New Zealand' WHERE name = 'New Zealander'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Nicaragua' WHERE name = 'Nicaraguan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Nigeria' WHERE name = 'Nigerian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Niger' WHERE name = 'Nigerien'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Niue' WHERE name = 'Niuean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Northern Ireland' WHERE name = 'Northern Irish'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Norway' WHERE name = 'Norwegian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Oman' WHERE name = 'Omani'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Pakistan' WHERE name = 'Pakistani'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Palau' WHERE name = 'Palauan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Palestine State' WHERE name = 'Palestinian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Panama' WHERE name = 'Panamanian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Papua New Guinea' WHERE name = 'Papua New Guinean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Paraguay' WHERE name = 'Paraguayan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Peru' WHERE name = 'Peruvian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Pitcairn Islands' WHERE name = 'Pitcairn Islander'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Poland' WHERE name = 'Polish'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Portugal' WHERE name = 'Portuguese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Puerto Rico' WHERE name = 'Puerto Rican'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Qatar' WHERE name = 'Qatari'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Romania' WHERE name = 'Romanian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Russia' WHERE name = 'Russian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Rwanda' WHERE name = 'Rwandan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Saint Martin' WHERE name = 'Saint-Martinoise'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'El Salvador' WHERE name = 'Salvadorean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'San Marino' WHERE name = 'Sammarinese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Samoa' WHERE name = 'Samoan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Sao Tome and Principe' WHERE name = 'Sao Tomean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Saudi Arabia' WHERE name = 'Saudi Arabian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Scotland' WHERE name = 'Scottish'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Senegal' WHERE name = 'Senegalese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Serbia' WHERE name = 'Serbian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Sierra Leone' WHERE name = 'Sierra Leonean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Singapore' WHERE name = 'Singaporean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Sint Maarten' WHERE name = 'Sint Maarten'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Slovakia' WHERE name = 'Slovak'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Slovenia' WHERE name = 'Slovenian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Solomon Islands' WHERE name = 'Solomon Islander'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'South Africa' WHERE name = 'South African'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'South Korea' WHERE name = 'South Korean'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Spain' WHERE name = 'Spanish'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Sri Lanka' WHERE name = 'Sri Lankan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Saint Helena' WHERE name = 'St Helenian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Saint Lucia' WHERE name = 'St Lucian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Sudan' WHERE name = 'Sudanese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Suriname' WHERE name = 'Surinamese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Svalbard' WHERE name = 'Svalbard'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Eswatini' WHERE name = 'Swazi'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Sweden' WHERE name = 'Swedish'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Switzerland' WHERE name = 'Swiss'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Taiwan' WHERE name = 'Taiwanese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Tajikistan' WHERE name = 'Tajik'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Tanzania' WHERE name = 'Tanzanian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Thailand' WHERE name = 'Thai'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Togo' WHERE name = 'Togolese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Tonga' WHERE name = 'Tongan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Trinidad and Tobago' WHERE name = 'Trinidadian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Tunisia' WHERE name = 'Tunisian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Turkey' WHERE name = 'Turkish'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Turkmenistan' WHERE name = 'Turkmen'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Turks and Caicos Islands' WHERE name = 'Turks and Caicos Islander'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Tuvalu' WHERE name = 'Tuvaluan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Uganda' WHERE name = 'Ugandan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Ukraine' WHERE name = 'Ukrainian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Uruguay' WHERE name = 'Uruguayan'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Uzbekistan' WHERE name = 'Uzbek'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Vatican City' WHERE name = 'Vatican citizen'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Vietnam' WHERE name = 'Vietnamese'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Saint Vincent and the Grenadines' WHERE name = 'Vincentian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Wallis and Futuna' WHERE name = 'Wallisian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Zambia' WHERE name = 'Zambian'` )
    await queryRunner.query(`UPDATE "nationalities" SET country_name = 'Zimbabwe' WHERE name = 'Zimbabwean'` )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "nationalities" SET country_name = null`)
  }

}