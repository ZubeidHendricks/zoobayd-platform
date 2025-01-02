import solc from 'solc';
import { ethers } from 'ethers';

interface CompilationResult {
  success: boolean;
  bytecode?: string;
  abi?: any[];
  errors?: string[];
}

interface CodeCompletionSuggestion {
  text: string;
  displayText: string;
  type: string;
}

class SmartContractIDEService {
  // Compile Solidity contract
  compileContract(sourceCode: string): CompilationResult {
    const input = {
      language: 'Solidity',
      sources: { 'contract.sol': { content: sourceCode } },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode']
          }
        },
        optimizer: { enabled: true, runs: 200 }
      }
    };

    try {
      const output = JSON.parse(solc.compile(JSON.stringify(input)));
      
      if (output.errors) {
        return {
          success: false,
          errors: output.errors.map((err: any) => err.formattedMessage)
        };
      }

      const contractName = Object.keys(output.contracts['contract.sol'])[0];
      const contract = output.contracts['contract.sol'][contractName];

      return {
        success: true,
        bytecode: contract.evm.bytecode.object,
        abi: contract.abi
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  // Gas estimation for contract deployment
  estimateDeploymentGas(
    abi: any[], 
    bytecode: string, 
    constructorArgs: any[] = []
  ): number {
    try {
      const contract = new ethers.ContractFactory(abi, bytecode);
      const estimatedGas = contract.signer.estimateGas(
        contract.getDeployTransaction(...constructorArgs)
      );

      return estimatedGas.toNumber();
    } catch (error) {
      console.error('Gas estimation failed', error);
      return 0;
    }
  }

  // Intelligent code completion suggestions
  provideCodeCompletion(
    sourceCode: string, 
    cursorPosition: number
  ): CodeCompletionSuggestion[] {
    const solidityKeywords = [
      'function', 'contract', 'modifier', 'event', 
      'mapping', 'struct', 'enum', 'require'
    ];

    const openZeppelinImports = [
      'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";',
      'import "@openzeppelin/contracts/access/Ownable.sol";',
      'import "@openzeppelin/contracts/security/ReentrancyGuard.sol";'
    ];

    const suggestions: CodeCompletionSuggestion[] = [
      ...solidityKeywords.map(keyword => ({
        text: keyword,
        displayText: `Solidity Keyword: ${keyword}`,
        type: 'keyword'
      })),
      ...openZeppelinImports.map(imp => ({
        text: imp,
        displayText: 'OpenZeppelin Import',
        type: 'import'
      }))
    ];

    return suggestions;
  }

  // Contract best practices checker
  checkBestPractices(sourceCode: string): string[] {
    const bestPracticeChecks = [
      {
        check: () => !/onlyOwner/.test(sourceCode),
        message: 'Missing access control mechanism'
      },
      {
        check: () => !/SafeMath/.test(sourceCode) && !/0\.8\.\d+/.test(sourceCode),
        message: 'Consider using SafeMath or Solidity 0.8+ for overflow protection'
      },
      {
        check: () => !/ReentrancyGuard/.test(sourceCode),
        message: 'Recommend adding reentrancy guard'
      }
    ];

    return bestPracticeChecks
      .filter(check => check.check())
      .map(check => check.message);
  }
}

export default new SmartContractIDEService();