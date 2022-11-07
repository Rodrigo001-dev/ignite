import { 
  FormControl, 
  FormLabel,
  Input as ChakraInput, 
  InputProps as ChakraInputProps 
} from "@chakra-ui/react";

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
};

export function Input({ name, label, ...rest }: InputProps) {
  return (
    /*
      o FormControl é um componente para ficar em volta da label e do input
    */
    <FormControl>
      {/* caso o label exista vai apresentar em tela o FormLabel */}
      { !!label && <FormLabel htmlFor={name}>{label}</FormLabel> }

      <ChakraInput 
        name={name}
        id={name}
        focusBorderColor="pink.500"
        bgColor="gray.900"
        variant="filled"
        _hover={{
          bgColor: 'gray.900'
        }}
        size="lg"
        {...rest}
      />
    </FormControl>
  );
};