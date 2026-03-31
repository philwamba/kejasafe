<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

abstract class BaseApiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    protected function paginationRules(int $maxPerPage = 100): array
    {
        return [
            'page' => ['nullable', 'integer', 'min:1'],
            'perPage' => ['nullable', 'integer', 'min:1', 'max:'.$maxPerPage],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->replace($this->trimPayload($this->all()));
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function trimPayload(array $payload): array
    {
        foreach ($payload as $key => $value) {
            if (is_string($value)) {
                $payload[$key] = trim($value);
                continue;
            }

            if (is_array($value)) {
                $payload[$key] = $this->trimPayload($value);
            }
        }

        return $payload;
    }
}
