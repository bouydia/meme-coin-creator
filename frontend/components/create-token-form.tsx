'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Info } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const formSchema = z.object({
  tokenName: z.string().min(1, 'Token name is required').max(50),
  symbol: z.string().min(1, 'Symbol is required').max(10),
  initialSupply: z
    .string()
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Initial supply must be a positive number',
    }),
  decimals: z.number().min(1).max(18),
  advancedSettings: z.boolean().default(false),
  canBurn: z.boolean().default(false),
  canMint: z.boolean().default(false),
  canPause: z.boolean().default(false),
  blacklist: z.boolean().default(false),
  deflation: z.boolean().default(false),
  superDeflation: z.boolean().default(false),
})

export function CreateTokenForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenName: '',
      symbol: '',
      initialSupply: '21000000',
      decimals: 18,
      advancedSettings: false,
      canBurn: false,
      canMint: false,
      canPause: false,
      blacklist: false,
      deflation: false,
      superDeflation: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-purple-100 rounded-xl shadow-lg text-purple-900">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="tokenName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-purple-900">
                  Token Name
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter your token&apos;s full name</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Good Luck Token"
                    {...field}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-purple-900">
                  Symbol
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Short identifier for your token (e.g. BTC, ETH)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. GLT"
                    {...field}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="initialSupply"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-900">
                  Initial Supply
                </FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Input {...field} className="bg-white" />
                    <span className="text-sm text-muted-foreground">
                      ≈ {Number(field.value).toLocaleString()} tokens
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="decimals"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-900">
                  Decimals (1-18)
                </FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        field.onChange(Math.max(1, field.value - 1))
                      }
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => {
                        const value = parseInt(e.target.value)
                        if (!isNaN(value) && value >= 1 && value <= 18) {
                          field.onChange(value)
                        }
                      }}
                      className="text-center bg-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        field.onChange(Math.min(18, field.value + 1))
                      }
                    >
                      +
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="advancedSettings"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-purple-900">
                    Advanced Settings
                  </FormLabel>
                  <FormDescription>
                    Enable additional token configuration options
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch('advancedSettings') && (
            <div className="space-y-4 border border-purple-300 rounded-lg p-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="canBurn"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-purple-900">
                          Can Burn
                        </FormLabel>
                        <FormDescription>Allow token burning</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canMint"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-purple-900">
                          Can Mint
                        </FormLabel>
                        <FormDescription>Allow token minting</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canPause"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-purple-900">
                          Can Pause
                        </FormLabel>
                        <FormDescription>
                          Allow pausing transfers
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="blacklist"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-purple-900">
                          Blacklist
                        </FormLabel>
                        <FormDescription>
                          Enable address blacklisting
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deflation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-purple-900">
                          Deflation
                        </FormLabel>
                        <FormDescription>
                          Enable deflationary mechanics
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="superDeflation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-purple-900">
                          Super Deflation
                        </FormLabel>
                        <FormDescription>
                          Enable enhanced deflation
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-yellow-400 text-purple-800 hover:bg-yellow-300"
          >
            Create Token
          </Button>
        </form>
      </Form>
    </div>
  )
}
