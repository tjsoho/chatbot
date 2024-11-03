import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Users } from 'lucide-react';

// Extensive name lists
const femaleNames = new Set([
  // Common English/American names
  'emma', 'olivia', 'ava', 'isabella', 'sophia', 'mia', 'charlotte', 'amelia', 'harper', 'evelyn',
  'abigail', 'emily', 'elizabeth', 'sofia', 'madison', 'avery', 'ella', 'scarlett', 'grace', 'chloe',
  'victoria', 'riley', 'aria', 'lily', 'aubrey', 'zoey', 'penelope', 'layla', 'lily', 'ellie',
  'hannah', 'addison', 'eleanor', 'natalie', 'luna', 'savannah', 'brooklyn', 'leah', 'zoe', 'stella',
  'hazel', 'eliza', 'violet', 'claire', 'audrey', 'bella', 'aurora', 'lucy', 'anna', 'samantha',
  'caroline', 'genesis', 'aaliyah', 'kennedy', 'kinsley', 'allison', 'maya', 'sarah', 'adeline', 'alexa',
  'ariana', 'elena', 'gabriella', 'naomi', 'alice', 'sadie', 'hailey', 'eva', 'emilia', 'autumn',
  'quinn', 'nevaeh', 'piper', 'ruby', 'serenity', 'willow', 'everly', 'cora', 'kaylee', 'lydia',
  'aubree', 'arianna', 'eliana', 'peyton', 'melanie', 'gianna', 'isabelle', 'julia', 'valentina', 'nova',
  'clara', 'vivian', 'reagan', 'mackenzie', 'madeline', 'delilah', 'faith', 'rose', 'margaret', 'molly',

  // Traditional names
  'mary', 'patricia', 'jennifer', 'linda', 'barbara', 'susan', 'jessica', 'helen', 'sandra', 'donna',
  'carol', 'ruth', 'sharon', 'michelle', 'laura', 'kimberly', 'deborah', 'rachel', 'lauren', 'julie',
  'karen', 'nancy', 'betty', 'dorothy', 'lisa', 'sandra', 'ashley', 'kimberly', 'donna', 'helen',
  'carol', 'michelle', 'betty', 'margaret', 'sandra', 'ashley', 'dorothy', 'lisa', 'patricia', 'nancy',

  // Modern names
  'skylar', 'paisley', 'savannah', 'brooklyn', 'bella', 'claire', 'liliana', 'adelaide', 'aubrey', 'ivy',
  'kinsley', 'audrey', 'maya', 'genesis', 'skylar', 'bella', 'autumn', 'quinn', 'sadie', 'piper',
  'ruby', 'serenity', 'willow', 'everly', 'cora', 'nova', 'emilia', 'luna', 'aurora', 'hazel',

  // International names
  'sofia', 'camila', 'valentina', 'valeria', 'mariana', 'lucia', 'julieta', 'martina', 'sara', 'emma',
  'sophie', 'amelie', 'charlotte', 'lea', 'anna', 'elena', 'chiara', 'giulia', 'sofia', 'maria',
  'ana', 'isabelle', 'emma', 'lea', 'sarah', 'lena', 'mila', 'sofia', 'emma', 'clara',

  // Additional common names
  'rebecca', 'katherine', 'catherine', 'christine', 'janet', 'debra', 'amanda', 'stephanie', 'carolyn', 'christine',
  'marie', 'janet', 'catherine', 'frances', 'ann', 'joyce', 'diane', 'alice', 'julie', 'heather',
  'teresa', 'doris', 'gloria', 'evelyn', 'jean', 'cheryl', 'mildred', 'katherine', 'joan', 'ashley',
  'judith', 'rose', 'janice', 'kelly', 'nicole', 'judy', 'christina', 'kathy', 'theresa', 'beverly',
  'denise', 'tammy', 'irene', 'jane', 'lori', 'rachel', 'marilyn', 'andrea', 'kathryn', 'louise',
  'sara', 'anne', 'jacqueline', 'wanda', 'bonnie', 'julia', 'ruby', 'lois', 'tina', 'phyllis',
  'norma', 'paula', 'diana', 'annie', 'lillian', 'emily', 'robin', 'peggy', 'crystal', 'gladys',
  'rita', 'dawn', 'connie', 'florence', 'tracy', 'edna', 'tiffany', 'carmen', 'rosa', 'cindy', 'shelly', 'Shelly',
  'grace', 'wendy', 'victoria', 'edith', 'kim', 'sherry', 'sylvia', 'josephine', 'thelma', 'shannon',
  'sheila', 'ethel', 'ellen', 'elaine', 'marjorie', 'carrie', 'charlotte', 'monica', 'esther', 'pauline', 'rach', 'rachy', 'billy'
]);

const maleNames = new Set([
  // Common English/American names
  'james', 'john', 'robert', 'michael', 'william', 'david', 'richard', 'joseph', 'thomas', 'charles',
  'christopher', 'daniel', 'matthew', 'anthony', 'donald', 'mark', 'paul', 'steven', 'andrew', 'kenneth',
  'joshua', 'kevin', 'brian', 'george', 'timothy', 'ronald', 'jason', 'edward', 'jeffrey', 'ryan',
  'jacob', 'gary', 'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin', 'scott', 'brandon',
  'benjamin', 'samuel', 'gregory', 'alexander', 'patrick', 'frank', 'raymond', 'jack', 'dennis', 'jerry',
  'tyler', 'aaron', 'jose', 'adam', 'nathan', 'henry', 'douglas', 'zachary', 'peter', 'kyle',
  'ethan', 'walter', 'noah', 'jeremy', 'christian', 'keith', 'roger', 'terry', 'gerald', 'harold',
  'sean', 'austin', 'carl', 'arthur', 'lawrence', 'dylan', 'jesse', 'jordan', 'bryan', 'billy',
  'joe', 'bruce', 'gabriel', 'logan', 'albert', 'willie', 'alan', 'juan', 'wayne', 'elijah',
  'randy', 'roy', 'vincent', 'ralph', 'eugene', 'russell', 'bobby', 'mason', 'philip', 'louis', 'toby',

  // Modern names
  'aiden', 'jackson', 'mason', 'liam', 'jayden', 'ethan', 'noah', 'lucas', 'logan', 'caleb',
  'caden', 'jack', 'ryan', 'connor', 'michael', 'alexander', 'jacob', 'daniel', 'luke', 'william',
  'owen', 'nathan', 'gabriel', 'matthew', 'henry', 'jackson', 'sebastian', 'aiden', 'david', 'joseph',
  'carter', 'luke', 'anthony', 'dylan', 'isaac', 'james', 'benjamin', 'lucas', 'henry', 'christopher',

  // International names
  'santiago', 'mateo', 'sebastian', 'matias', 'nicolas', 'alejandro', 'diego', 'samuel', 'benjamin', 'carlos',
  'lucas', 'maximilian', 'leon', 'luis', 'julian', 'marco', 'antonio', 'miguel', 'felipe', 'juan',
  'luca', 'matteo', 'alessandro', 'lorenzo', 'giovanni', 'francesco', 'giuseppe', 'andrea', 'marco', 'antonio',

  // Additional common names
  'howard', 'martin', 'phillip', 'norman', 'joshua', 'craig', 'earl', 'glenn', 'lloyd', 'curtis',
  'travis', 'frederick', 'barry', 'bernard', 'leroy', 'marcus', 'theodore', 'clifford', 'miguel', 'oscar',
  'jay', 'jim', 'tom', 'calvin', 'jon', 'ronnie', 'bill', 'lloyd', 'tommy',
  'leon', 'derek', 'warren', 'darrell', 'jerome', 'floyd', 'leo', 'alvin', 'tim', 'wesley',
  'gordon', 'dean', 'greg', 'jorge', 'dustin', 'pedro', 'derrick', 'dan', 'lewis', 'zachary',
  'corey', 'herman', 'maurice', 'vernon', 'roberto', 'clyde', 'glen', 'hector', 'shane', 'ricardo',
  'sam', 'rick', 'lester', 'brent', 'ramon', 'charlie', 'tyler', 'gilbert', 'gene', 'marc',
  'reginald', 'ruben', 'brett', 'angel', 'nathaniel', 'rafael', 'leslie', 'edgar', 'milton', 'raul',
  'ben', 'chester', 'cecil', 'duane', 'franklin', 'andre', 'elmer', 'brad', 'gabriel', 'ron',
  'mitchell', 'roland', 'arnold', 'harvey', 'jared', 'adrian', 'karl', 'cory', 'claude', 'erik'
]);

// Add these names to femaleNames
femaleNames.add('shelly');
femaleNames.add('Shelly');
femaleNames.add('rach');
femaleNames.add('rachy');
femaleNames.add('billy'); // Note: billy could be both male/female

interface GenderStats {
  male: number;
  female: number;
  unknown: number;
  total: number;
}

export default function GenderDistribution() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GenderStats>({
    male: 0,
    female: 0,
    unknown: 0,
    total: 0
  });

  const determineGender = (name: string): 'male' | 'female' | 'unknown' => {
    // Handle empty or invalid names
    if (!name || typeof name !== 'string') return 'unknown';

    // Get first name and convert to lowercase for comparison
    const firstName = name.trim().toLowerCase().split(' ')[0];

    // Check against name sets (now case insensitive)
    if (maleNames.has(firstName)) return 'male';
    if (femaleNames.has(firstName)) return 'female';

    // Handle common nicknames and variations
    const nicknames: Record<string, 'male' | 'female' | 'unknown'> = {
      'bill': 'male',
      'billy': 'male',
      'will': 'male',
      'rob': 'male',
      'bob': 'male',
      'bobby': 'male',
      'dick': 'male',
      'rick': 'male',
      'rich': 'male',
      'jim': 'male',
      'jimmy': 'male',
      'joe': 'male',
      'joey': 'male',
      'tom': 'male',
      'tommy': 'male',
      'dan': 'male',
      'danny': 'male',
      'mike': 'male',
      'mikey': 'male',
      'chris': 'unknown', // Changed to 'unknown' since it can be both male/female
      
      'beth': 'female',
      'liz': 'female',
      'lizzy': 'female',
      'betty': 'female',
      'kate': 'female',
      'kathy': 'female',
      'katie': 'female',
      'kat': 'female',
      'alex': 'unknown',
      'sandra': 'female',
      'sandy': 'female',
      'becky': 'female',
      'becca': 'female',
      'vicky': 'female',
      'vic': 'female',
      'abby': 'female',
      'gaby': 'female',
      'gabby': 'female',
      'maddy': 'female',
      'maddie': 'female',
      'maggie': 'female',
      'meg': 'female',
      'peggy': 'female',
      'sue': 'female',
      'suzy': 'female',
      'susie': 'female',
      'sally': 'female',
      'sal': 'female',
      'tina': 'female',
      'deb': 'female',
      'debbie': 'female',
      'jen': 'female',
      'jenny': 'female',
      'jenn': 'female',
      'val': 'female',
      'valerie': 'female',
      'pat': 'female', // Note: Pat could be both
      'patty': 'female',
      'trish': 'female',
      'rach': 'female',
      'rachy': 'female',
      'shelly': 'female'
    };

    // Check nicknames
    if (nicknames[firstName]) return nicknames[firstName];

    // Handle special cases for names ending in common suffixes
    if (firstName.endsWith('ette') || 
        firstName.endsWith('elle') || 
        firstName.endsWith('ella') || 
        firstName.endsWith('ina') || 
        firstName.endsWith('lyn') ||
        firstName.endsWith('leigh')) {
      return 'female';
    }

    return 'unknown';
  };

  useEffect(() => {
    const fetchGenderDistribution = async () => {
      try {
        const q = query(collection(db, "chats"));
        const querySnapshot = await getDocs(q);
        
        const distribution = {
          male: 0,
          female: 0,
          unknown: 0,
          total: 0
        };

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userDetails?.name) {
            const gender = determineGender(data.userDetails.name);
            distribution[gender]++;
            distribution.total++;
          }
        });

        setStats(distribution);
      } catch (error) {
        console.error("Error fetching gender distribution:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderDistribution();
  }, []);

  const calculatePercentage = (value: number): string => {
    return stats.total ? `${((value / stats.total) * 100).toFixed(1)}%` : '0%';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">User Demographics</h3>
        <Users className="text-blue-500" size={24} />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Distribution Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Male</span>
                <span>{calculatePercentage(stats.male)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: calculatePercentage(stats.male) }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Female</span>
                <span>{calculatePercentage(stats.female)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-500"
                  style={{ width: calculatePercentage(stats.female) }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Undetermined</span>
                <span>{calculatePercentage(stats.unknown)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-400"
                  style={{ width: calculatePercentage(stats.unknown) }}
                ></div>
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="pt-4 border-t">
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.total.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 