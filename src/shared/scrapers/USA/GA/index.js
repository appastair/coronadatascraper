import * as fetch from '../../../lib/fetch/index.js';
import * as parse from '../../../lib/parse.js';
import * as geography from '../../../lib/geography/index.js';
import * as transform from '../../../lib/transform.js';

// Set county to this if you only have state data, but this isn't the entire state
const UNASSIGNED = '(unassigned)';

const scraper = {
  state: 'GA',
  country: 'USA',
  url:
    'https://d20s4vd27d0hk0.cloudfront.net/?initialWidth=746&childId=covid19dashdph&parentTitle=COVID-19%20Daily%20Status%20Report%20%7C%20Georgia%20Department%20of%20Public%20Health&parentUrl=https%3A%2F%2Fdph.georgia.gov%2Fcovid-19-daily-status-report',
  type: 'table',
  aggregate: 'county',
  sources: [
    {
      name: 'Georgia Department of Public Health',
      url: 'https://dph.georgia.gov/covid-19-daily-status-report'
    }
  ],
  _counties: [
    'Appling County',
    'Atkinson County',
    'Bacon County',
    'Baker County',
    'Baldwin County',
    'Banks County',
    'Barrow County',
    'Bartow County',
    'Ben Hill County',
    'Berrien County',
    'Bibb County',
    'Bleckley County',
    'Brantley County',
    'Brooks County',
    'Bryan County',
    'Bulloch County',
    'Burke County',
    'Butts County',
    'Calhoun County',
    'Camden County',
    'Candler County',
    'Carroll County',
    'Catoosa County',
    'Charlton County',
    'Chatham County',
    'Chattahoochee County',
    'Chattooga County',
    'Cherokee County',
    'Clarke County',
    'Clay County',
    'Clayton County',
    'Clinch County',
    'Cobb County',
    'Coffee County',
    'Colquitt County',
    'Columbia County',
    'Cook County',
    'Coweta County',
    'Crawford County',
    'Crisp County',
    'Dade County',
    'Dawson County',
    'Decatur County',
    'DeKalb County',
    'Dodge County',
    'Dooly County',
    'Dougherty County',
    'Douglas County',
    'Early County',
    'Echols County',
    'Effingham County',
    'Elbert County',
    'Emanuel County',
    'Evans County',
    'Fannin County',
    'Fayette County',
    'Floyd County',
    'Forsyth County',
    'Franklin County',
    'Fulton County',
    'Gilmer County',
    'Glascock County',
    'Glynn County',
    'Gordon County',
    'Grady County',
    'Greene County',
    'Gwinnett County',
    'Habersham County',
    'Hall County',
    'Hancock County',
    'Haralson County',
    'Harris County',
    'Hart County',
    'Heard County',
    'Henry County',
    'Houston County',
    'Irwin County',
    'Jackson County',
    'Jasper County',
    'Jeff Davis County',
    'Jefferson County',
    'Jenkins County',
    'Johnson County',
    'Jones County',
    'Lamar County',
    'Lanier County',
    'Laurens County',
    'Lee County',
    'Liberty County',
    'Lincoln County',
    'Long County',
    'Lowndes County',
    'Lumpkin County',
    'Macon County',
    'Madison County',
    'Marion County',
    'McDuffie County',
    'McIntosh County',
    'Meriwether County',
    'Miller County',
    'Mitchell County',
    'Monroe County',
    'Montgomery County',
    'Morgan County',
    'Murray County',
    'Muscogee County',
    'Newton County',
    'Oconee County',
    'Oglethorpe County',
    'Paulding County',
    'Peach County',
    'Pickens County',
    'Pierce County',
    'Pike County',
    'Polk County',
    'Pulaski County',
    'Putnam County',
    'Quitman County',
    'Rabun County',
    'Randolph County',
    'Richmond County',
    'Rockdale County',
    'Schley County',
    'Screven County',
    'Seminole County',
    'Spalding County',
    'Stephens County',
    'Stewart County',
    'Sumter County',
    'Talbot County',
    'Taliaferro County',
    'Tattnall County',
    'Taylor County',
    'Telfair County',
    'Terrell County',
    'Thomas County',
    'Tift County',
    'Toombs County',
    'Towns County',
    'Treutlen County',
    'Troup County',
    'Turner County',
    'Twiggs County',
    'Union County',
    'Upson County',
    'Walker County',
    'Walton County',
    'Ware County',
    'Warren County',
    'Washington County',
    'Wayne County',
    'Webster County',
    'Wheeler County',
    'White County',
    'Whitfield County',
    'Wilcox County',
    'Wilkes County',
    'Wilkinson County',
    'Worth County'
  ],
  async scraper() {
    const $ = await fetch.page(this.url);
    let counties = [];
    const $trs = $('table:nth-child(6) tbody tr:not(:first-child)');
    $trs.each((index, tr) => {
      const $tr = $(tr);
      const name = $tr.find('td:first-child').text();
      let county = geography.addCounty(parse.string(name.replace('Dekalb', 'DeKalb')));

      const cases = parse.number($tr.find('td:nth-child(2)').text());
      const deaths = parse.number($tr.find('td:last-child').text());

      if (county === 'Unknown County') {
        county = UNASSIGNED;
      }
      counties.push({ county, cases, deaths });
    });

    counties.push(transform.sumData(counties));

    counties = geography.addEmptyRegions(counties, this._counties, 'county');

    return counties;
  }
};

export default scraper;
