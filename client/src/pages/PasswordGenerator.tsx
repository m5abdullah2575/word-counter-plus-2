import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { FaKey, FaCopy, FaRedo, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const CHARACTER_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  ambiguous: '0O1lI|`'
};

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([16]);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false
  });
  const [showPassword, setShowPassword] = useState(true);
  const { toast } = useToast();

  useSEO({
    title: 'Password Generator - Word Counter Plus',
    description: 'Generate secure passwords with customizable length and character sets. Create strong passwords for maximum security.',
    keywords: 'password generator, secure password, random password, strong password, security'
  });

  const getPasswordStrength = (pwd: string): { score: number; level: string; color: string } => {
    let score = 0;
    
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    if (pwd.length >= 16) score += 1;
    
    if (score <= 2) return { score: score * 20, level: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score: score * 20, level: 'Fair', color: 'bg-yellow-500' };
    if (score <= 5) return { score: score * 20, level: 'Good', color: 'bg-blue-500' };
    return { score: 100, level: 'Strong', color: 'bg-green-500' };
  };

  const getSecureRandomInt = (max: number): number => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
  };

  const generatePassword = useCallback(() => {
    let charset = '';
    
    if (options.lowercase) charset += CHARACTER_SETS.lowercase;
    if (options.uppercase) charset += CHARACTER_SETS.uppercase;
    if (options.numbers) charset += CHARACTER_SETS.numbers;
    if (options.symbols) charset += CHARACTER_SETS.symbols;
    
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !CHARACTER_SETS.ambiguous.includes(char)).join('');
    }
    
    if (!charset) {
      toast({
        title: "No Characters Selected",
        description: "Please select at least one character type.",
        variant: "destructive",
      });
      return;
    }
    
    let result = '';
    const passwordLength = length[0];
    
    // Ensure at least one character from each selected category
    const requiredChars = [];
    if (options.lowercase) {
      const chars = options.excludeAmbiguous 
        ? CHARACTER_SETS.lowercase.split('').filter(char => !CHARACTER_SETS.ambiguous.includes(char))
        : CHARACTER_SETS.lowercase.split('');
      requiredChars.push(chars[getSecureRandomInt(chars.length)]);
    }
    if (options.uppercase) {
      const chars = options.excludeAmbiguous 
        ? CHARACTER_SETS.uppercase.split('').filter(char => !CHARACTER_SETS.ambiguous.includes(char))
        : CHARACTER_SETS.uppercase.split('');
      requiredChars.push(chars[getSecureRandomInt(chars.length)]);
    }
    if (options.numbers) {
      const chars = options.excludeAmbiguous 
        ? CHARACTER_SETS.numbers.split('').filter(char => !CHARACTER_SETS.ambiguous.includes(char))
        : CHARACTER_SETS.numbers.split('');
      requiredChars.push(chars[getSecureRandomInt(chars.length)]);
    }
    if (options.symbols) {
      requiredChars.push(CHARACTER_SETS.symbols[getSecureRandomInt(CHARACTER_SETS.symbols.length)]);
    }
    
    // Add required characters
    for (let i = 0; i < Math.min(requiredChars.length, passwordLength); i++) {
      result += requiredChars[i];
    }
    
    // Fill remaining length with random characters
    for (let i = requiredChars.length; i < passwordLength; i++) {
      result += charset.charAt(getSecureRandomInt(charset.length));
    }
    
    // Shuffle the password to avoid predictable patterns using secure randomness
    const shuffled = result.split('');
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = getSecureRandomInt(i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    result = shuffled.join('');
    
    setPassword(result);
    
    toast({
      title: "Password Generated",
      description: `Generated a ${passwordLength}-character password using secure randomness.`,
    });
  }, [length, options, toast]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Password Copied",
        description: "Password has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy password to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const passwordStrength = password ? getPasswordStrength(password) : { score: 0, level: 'None', color: 'bg-gray-300' };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FaKey className="text-3xl text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Password Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate secure passwords with customizable options. Create strong, unique passwords to protect your accounts.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaShieldAlt className="text-primary" />
                Password Settings
              </CardTitle>
              <CardDescription>
                Customize your password generation options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Length Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Password Length</Label>
                  <span className="text-sm text-muted-foreground font-mono" data-testid="text-length">
                    {length[0]} characters
                  </span>
                </div>
                <Slider
                  value={length}
                  onValueChange={setLength}
                  max={128}
                  min={4}
                  step={1}
                  className="w-full"
                  data-testid="slider-length"
                />
              </div>

              {/* Character Options */}
              <div className="space-y-4">
                <Label>Character Types</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={options.lowercase}
                      onCheckedChange={() => handleOptionChange('lowercase')}
                      data-testid="checkbox-lowercase"
                    />
                    <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={options.uppercase}
                      onCheckedChange={() => handleOptionChange('uppercase')}
                      data-testid="checkbox-uppercase"
                    />
                    <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={options.numbers}
                      onCheckedChange={() => handleOptionChange('numbers')}
                      data-testid="checkbox-numbers"
                    />
                    <Label htmlFor="numbers">Numbers (0-9)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={options.symbols}
                      onCheckedChange={() => handleOptionChange('symbols')}
                      data-testid="checkbox-symbols"
                    />
                    <Label htmlFor="symbols">Symbols (!@#$%)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <Checkbox
                      id="excludeAmbiguous"
                      checked={options.excludeAmbiguous}
                      onCheckedChange={() => handleOptionChange('excludeAmbiguous')}
                      data-testid="checkbox-exclude-ambiguous"
                    />
                    <Label htmlFor="excludeAmbiguous">Exclude ambiguous characters (0, O, 1, l, I, |)</Label>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button onClick={generatePassword} className="w-full" data-testid="button-generate">
                <FaRedo className="mr-2" />
                Generate Password
              </Button>
            </CardContent>
          </Card>

          {/* Generated Password */}
          {password && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Generated Password</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      data-testid="button-toggle-visibility"
                    >
                      {showPassword ? <FaEyeSlash className="mr-2" /> : <FaEye className="mr-2" />}
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyToClipboard} data-testid="button-copy">
                      <FaCopy className="mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Password Display */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="font-mono text-lg break-all" data-testid="text-password">
                    {showPassword ? password : '●'.repeat(password.length)}
                  </div>
                </div>

                {/* Password Strength */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Password Strength</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded text-white ${passwordStrength.color}`}>
                      {passwordStrength.level}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                </div>

                {/* Password Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-semibold">Length:</span> {password.length}
                  </div>
                  <div>
                    <span className="font-semibold">Lowercase:</span> {(password.match(/[a-z]/g) || []).length}
                  </div>
                  <div>
                    <span className="font-semibold">Uppercase:</span> {(password.match(/[A-Z]/g) || []).length}
                  </div>
                  <div>
                    <span className="font-semibold">Numbers:</span> {(password.match(/[0-9]/g) || []).length}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaShieldAlt className="text-primary" />
                Password Security Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use a unique password for each account</li>
                <li>• Longer passwords are generally more secure</li>
                <li>• Include a mix of character types for better security</li>
                <li>• Store passwords in a secure password manager</li>
                <li>• Enable two-factor authentication when available</li>
                <li>• Avoid using personal information in passwords</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}