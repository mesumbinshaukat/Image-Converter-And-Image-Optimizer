<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Image;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ImageDownloadController extends Controller
{
    /**
     * Download the processed image file.
     *
     * @param int $id Image record ID
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function download($id)
    {
        $image = Image::findOrFail($id);
        $path = $image->processed_path;
        if (!file_exists($path)) {
            abort(404, 'File not found');
        }
        return response()->download($path);
    }
}
